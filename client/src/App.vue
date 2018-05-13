<template>
  <div>
    <div v-show="isConnected">
       <section class="box" v-if="loggedin">
      
      <div><question v-if="enabled"  :user="user" :q="question"/>
      <div v-else> Wait for the next Round</div>
      
      </div>
      
      
      </section>
      <section class="box" v-show="!loggedin">
        <div id="login">
          <h3>Enter a username to play the game</h3>
        <input type="text" v-model="username"/>
        <button @click="login()">Login</button>
        <p class="error" v-show="loginerror">{{errormsg}}</p>
        </div>
    </section>
    </div>
  </div>
</template>

<script>
import Question from "./components/Question.vue";
export default {
  name: 'App',
   components : {
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
      loggedin: false,
      loginerror:false,
      errormsg: ""
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
   },
   failedJoin(data){
     if(data.id == this.$socket.id){
     this.errormsg = data.message
     this.loginerror = true;
   }
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
<style scoped lang="scss">

.box {
  position:relative;
  width:70%;
  top: 50px;
  height:400px;
  background:#e6e7f0;
  border:2px ridge gold;
  border-radius:10px;
  box-shadow: 3px 3px 10px grey;
  left:15%;
  padding: 10px;
}
.error {
  color:red;
}
#login {
  text-align: center;
  padding:5px;
}

</style>