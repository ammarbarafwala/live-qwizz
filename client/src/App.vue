<template>
  <div>
    <section class="box" v-if="logged_in">
      <span v-text="timer" id="timer" v-bind:class="{'green' : timer >= 20, 'red' : timer < 20 && timer >= 16, 'yellow' : timer < 16  }"></span>
      <div v-if="!display_result">
        <Question v-if="enabled" :user="user" :q="question" @interface="validate"/>
        <div v-else><p class="banner"> Wait for the next round</p></div>
      </div>
      <div v-else>
        <Result :result="result"  :question="question"/>
      </div>
    </section>

    <section class="box" v-show="!logged_in">
      <div id="login">
        <h3>Enter a username to play the Game</h3>
        <input type="text" v-model="username"/>
        <button @click="login()">Login</button>
        <p class="error" v-show="login_error">{{socket_message}}</p>
      </div>
    </section>

  </div>
</template>

<script>
import Question from "./components/Question.vue";
import Result from "./components/Result.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    Question,
    Result
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
        now() {
            this.timer = this.timestamp - this.now
            if(this.timer <= 0){
              this.timer = 30
              // Remove interval
              clearInterval(this.interval)
              this.socket.emit("change-question",this.username);
            }

            if(this.timer<=15 && !this.display_result && this.enabled){
              this.socket.emit("validate", this.user);
            }
        }
   },

  methods: {
    validate(value){
      this.user.answer = value
    },
    login() {
      this.socket.emit("join-user", this.username);
    }
  },

  mounted() {

    const getCurrentSeconds = () => Math.trunc( new Date().getTime() / 1000)

    const refreshQuestion = ({question, time}) => {
      this.display_result = false
      this.user.answer = 'n'
      this.question = question
      this.timestamp = Math.trunc(time/1000)
      this.interval = setInterval(() => {
            this.now = getCurrentSeconds()
      }, 1000)
    }

    this.socket.on('display-results', ({result,username}) => {
        if(this.enabled){
          if(username == this.username)
            this.display_result = true
          this.result = result
        }
    })

    this.socket.on("successful-join", ({user, current}) => {
      if (user.username === this.username) {
        this.login_error = false;
        this.user = user;
        this.logged_in = true;
        refreshQuestion(current)
        this.enabled = (this.timestamp - getCurrentSeconds())>20
      }
    });

    this.socket.on('failed-join', ({username, msg}) => {
     this.login_error = true;
      if (username === this.username) {
        this.socket_message = msg
      }
    })

    this.socket.on('refresh-question', (current) =>{
      this.enabled = true
      refreshQuestion(current)
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
.banner {
  padding:10px;
  font-size:40px;
  color:#444455;
  text-shadow: 2px 2px 10px gray;
  position:relative;
  top:10px;
  left:10px;
  text-align: center;
}
#login {
  text-align: center;
  padding: 5px;
}

.green {
  background-color:#55ff55;
}
.red {
  background-color:#ff5555;
}
.yellow {
  background-color:#eeee55;
}

#timer {
  padding:10px;
  display: inline-block;
  width: 20px;
  text-align:center;
  position:absolute;
  top:0;
  right:0;
  border:1px solid gray;
  border-radius:20px;
}
</style>