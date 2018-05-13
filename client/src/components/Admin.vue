<template>
  <div id="app">
    
  <div class="question">
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
 <input type="radio" name="answer" v-model="answer" value='a'  /> answer?
   </div>

    <div class="form-input">
 <label>Option B</label><input type="text" v-model="options.b"/> 
 <input type="radio" name="answer" v-model="answer" value='b' /> answer?
    </div>

 <div class="form-input">
 <label>Option C</label><input type="text" v-model="options.c"/> 
 <input type="radio" name="answer" v-model="answer" value='c'  />answer?
 </div>

 <button @click="submit()">Submit Question</button>
    </section>
  </div>
  <div class="question">
    <header class="header"><h3>
      Question Bank
    </h3></header>
    <section class="body">
      <ol>
      <li v-for="question in question_list" :key="question.id">
        <p>{{question.question}}</p>
        <button @click="remove(question.id)">Remove</button>
      </li>
      </ol>
    </section>
  </div>


  </div>
</template>

<script>
 import io from 'socket.io-client';
export default {

  name: 'admin',
  data () {
    return {
     question : "",
     answer: "",
     options:{},
     question_list : [],
     socket: io("http://localhost:3000"),
    }
  },
  components : {
    
  },
  sockets :{

  },
  methods: {
    submit(){
      const q  = {}
      let last_id = this.question_list[this.question_list.length-1].id;
      q.id = last_id + 1;
      q.question = this.question;
      q.options = this.options;
      q.answer = this.answer;
      this.question_list.push(q)
      this.socket.emit("update-questions", this.question_list);
      this.question=""
      this.answer=""
      this.options = {}
    },

    remove(id) {
      console.log(this.question_list)
      console.log(id)
      this.question_list = this.question_list.filter(q=>{
        return q.id != id;
      })
      console.log(this.question_list)
        this.socket.emit("update-questions", this.question_list);
    }
  },
  created() {
    this.socket.emit("get-questions")
  },
   mounted() {
    
    this.socket.on('refresh-question-list', (questions) => {
       this.question_list = questions;
       console.log(questions)
    })
   }
}

</script>
<style scoped lang="scss">
label {
  display:block;
}
#app {
  width:100%;
  display:flex;
  flex-flow: row;
  box-sizing:border-box;
   position:relative;
  top: 50px;
  justify-content: space-around;
}

textarea {
  width:400px;
  height:150px;
}

.form-input {
  padding : 1px, 5px;
  margin:1px;
}

li {
  display: block;
  padding:2px;
  background:white;
  margin-bottom:5px;
}

.question {
 
  width:45%;
  background:rgb(224, 228, 250);
  text-align:justify;
  box-sizing:border-box;
  overflow: scroll;
  height:500px;
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
