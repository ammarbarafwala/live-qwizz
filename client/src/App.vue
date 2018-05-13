<template>
  <div>

    <section class="box" v-if="logged_in">
      <span v-text="timer"></span>
      <div><Question v-if="enabled" :user="user" :q="question"/>
        <div v-else> Wait for the next Round</div>
      </div>
    </section>

    <section class="box" v-show="!logged_in">
      <div id="login">
        <h3>Enter a username to play the this</h3>
        <input type="text" v-model="username"/>
        <button @click="login()">Login</button>
        <p class="error" v-show="login_error">{{error_message}}</p>
      </div>
    </section>

  </div>
</template>

<script>
import Question from "./components/Question.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    Question
  },
  data(){
    return{
      username: "",
      socket_message: "",
      question: {},
      user: {},
      user_list: [],
      logged_in: false,
      login_error: false,
      error_message: '',
      socket: io("http://localhost:3000"),
      now: null,
      timestamp: null,
      timer: null,
      interval: null
    }
  },
   watch: {
        now(value) {
            this.timer = this.timestamp - this.now
            if(this.timer <= 0){
              this.timer = 0
              // Remove interval
              clearInterval(this.interval);
              this.socket.emit("change-question");
            }
        }
   },

  computed: {
    enabled: function() {
      console.log('enabled')
      return true
    }
  },

  methods: {

    login() {
      console.log("login");
      this.socket.emit("join-user", this.username);
    }
  },

  mounted() {
    
    this.socket.on('refresh-users', function (user_list) {
        this.user_list = user_list
    })

    this.socket.on("successful-join", (user, data) => {
      if (user.username === this.username) {
        console.log('joined')
        this.user = user;
        this.logged_in = true;
      }
      this.user_list.push(user)
    });

    this.socket.on('failed-join', ({username, msg}) => {
      console.log('failed')
      if (username === this.username) {
        console.log(msg)
        this.error_message = msg
      }
    })

    this.socket.on('refresh-question', ({question, time}) =>{
        console.log('new question')
        console.log(question)
        this.question = question;
        this.timestamp = Math.trunc(time/1000)
        this.interval = setInterval(() => {
            this.now = Math.trunc((new Date()).getTime() / 1000);
        }, 1000);
    })
  }
}
</script>

<style scoped lang="scss">
.box {
  position: relative;
  width: 70%;
  top: 50px;
  height: 400px;
  background: #e6e7f0;
  border: 2px ridge gold;
  border-radius: 10px;
  box-shadow: 3px 3px 10px grey;
  left: 15%;
  padding: 10px;
}
.error {
  color: red;
}
#login {
  text-align: center;
  padding: 5px;
}
</style>