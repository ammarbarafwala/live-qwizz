<template>
  <div id="app">
      <app/>
    <div v-show="isConnected">
       <div v-if="loggedin">
      
      <div v-if="user"><question v-if="enabled"  :user="user" :q="question"/>
      <div v-else> Wait for the next Round</div></div>
      
      
      </div>
      <div v-show="!loggedin">
        <input type="text" v-model="username"/>
        <button @click="login()">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import App from "./App.vue";
import Question from "./Question.vue";
export default {
  name: 'home',
   components : {
    App,
    Question
  },
  data() {
    return {
      isConnected: false,
      username:'',
      socketMessage: '',
      question: {},
      timestamp : null,
      user :{},
      loggedin: false
    }
  },

  computed:{
    enabled : function(){
       
          return this.user.joined - this.timestamp < 25000
      
    },
    connected : function(){
     return this.$socket.connected
     //return true;
    }
  },

  sockets: {
    connect() {
      // Fired when the socket connects.
      
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    successfulJoin(user){
      this.user = user;
      this.loggedin = true;
      console.log(user)
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
    },

   refreshQuestion(data) {
     this.question = data.question;
     this.timestamp = data.time;
   },
   validated(user){
     console.log(user)
   }
  },

  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', 'PING!')
      console.log(this.$socket.id);
    },
    login() {
      this.$socket.emit('join-user', this.username);
    }
  }
}

</script>