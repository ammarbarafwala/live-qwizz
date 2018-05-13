<template>
  <div>
    <section class="box" v-if="logged_in">
      <span v-text="timer"></span>
      <div v-if="!display_result"><Question v-if="enabled" :user="user" :q="question" @interface="validate"/>
        <div v-else> Wait for the next Round</div>
      </div>
      <div v-else>
        Correct Answer: {{question.answer}}<br/>
        Players and their choices
        <ul>
          <li>
            {{result.a}} Players selected {{question.options.a}}
          </li>
          <li>
            {{result.b}} Players selected {{question.options.b}}
          </li>
          <li>
            {{result.c}} Players selected {{question.options.c}}
          </li>
        </ul>
      </div>
    </section>

    <section class="box" v-show="!logged_in">
      <div id="login">
        <h3>Enter a username to play the Game</h3>
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
      interval: null,
      display_result: false,
      result:{},
      enabled: false
    }
  },
   watch: {
        now(value) {
            this.timer = this.timestamp - this.now
            if(this.timer <= 0){
              this.enabled = true
              this.timer = 30
              // Remove interval
              clearInterval(this.interval)
              this.socket.emit("change-question",this.username);
            }
            if(this.timer<=15 && !this.display_result && this.enabled){
              this.socket.emit("validate", this.user);
              console.log(this.user)
            }
        }
   },

  methods: {
    validate(value){
      this.user.answer = value
      console.log(this.user.answer)
    },
    login() {
      console.log("login");
      this.socket.emit("join-user", this.username);
    }
  },

  mounted() {
    
    this.socket.on('refresh-users', (user_list) => {
        this.display_result = true
        this.user_list = user_list
    })

    this.socket.on('display-results', (result) => {
        if(this.enabled){
          this.display_result = true
          this.result = result
          console.log(this.result)
        }
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

    this.socket.on('refresh-question', ({username, question, time}) =>{
        console.log('new question')
        this.user.current_answer = ''
        this.display_result = false
        this.question = question;
        this.timestamp = Math.trunc(time/1000)
        this.interval = setInterval(() => {
            this.now = Math.trunc((new Date()).getTime() / 1000);
        }, 1000);
        if (username === this.username)
          this.enabled = (this.timestamp - Math.trunc((new Date()).getTime() / 1000))>20
        console.log(this.enabled)
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