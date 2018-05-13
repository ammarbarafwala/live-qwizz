<template>
  <div id="app">
    
  <div id="question">
    <header class="header"><h3>
      Add a question
    </h3></header>
    <section class="body">
  <label>Question</label>
  <div class="form-input">
<textarea v-model="question"></textarea>
  </div>

   <div class="form-input">
 <label>Option A</label><input type="text" v-model="options.a"/> 
 <input type="radio" name="answer" v-model="answer" v-bind:value="options.a"  /> answer?
   </div>

    <div class="form-input">
 <label>Option B</label><input type="text" v-model="options.b"/> 
 <input type="radio" name="answer" v-model="answer" v-bind:value="options.b" /> answer?
    </div>

 <div class="form-input">
 <label>Option C</label><input type="text" v-model="options.c"/> 
 <input type="radio" name="answer" v-model="answer" v-bind:value="options.c"  />answer?
 </div>

 <button @click="submit()">Submit Question</button>
    </section>
  </div>


  </div>
</template>

<script>
 import io from 'socket.io-client';
 const socket = io('http://localhost:3000');
export default {

  name: 'admin',
  data () {
    return {
      a: "",
     question : "",
     answer: "",
     options:{}
    }
  },
  components : {
    
  },
  sockets :{

  },
  methods: {
    submit(){
      const q  = {}
      q.question = this.question;
      q.options = this.options;
      q.answer = this.answer;
      socket.emit("save-question", q);
    }
  },
}

</script>
<style scoped lang="scss">
label {
  display:block;
}

textarea {
  width:400px;
  height:150px;
}

.form-input {
  padding : 1px, 5px;
  margin:1px;
}

#question {
  position:relative;
  left:20%;
  top: 50px;
  width:60%;
  background:rgb(224, 228, 250);
  text-align:justify;
}
.body {
  padding:15px 50px;
  margin:10px;
  text-align: justify;
}

.header {
  text-align:center;
}
.form-input {
  padding:5px;
  margin: 0 5px;
}
</style>
