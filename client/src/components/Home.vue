<template>
  <div id="app">
      <app/>
    This is the Home page
    <div v-if="isConnected">
      <p>We're connected to the server!</p>
      <div>{{question.question}}</div>
 
    </div>
    <button @click="pingServer()">ping</button>
  </div>
</template>

<script>
import App from "./App.vue";
export default {
  name: 'home',
   components : {
    App
  },
  data() {
    return {
      isConnected: false,
      socketMessage: '',
      question: {},
      user :{},
      enabled: false
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

    successfulJoin(user, question){
      this.user = user;
      this.question = question.question
      if((new Date() - question.time) < 25000) {
        this.enabled = true;
      }
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
    },

   refreshQuestion(data) {
     this.question = data.question
     console.log(this.question)
     this.enabled = false
   }
  },

  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', 'PING!')
      console.log(this.$socket.id);
    }
  }
}

</script>