<template lang="html">

  <section class="question">
    <h1>{{q.question}}</h1>
      <ul>
        <li v-for="(value, index) in q.options" @click="validate(index)">
            <span>{{index}}</span><span>{{value}}</span>
        </li>
      </ul>
  </section>

</template>

<script lang="js">
import io from "socket.io-client";

  export default  {
    
    name: 'question',
    props: ['q', 'user'],
    mounted() {

    },
    data() {
      return {
        socket: io("http://localhost:3000"),
        answer:''
      }
    },
    methods: {
      validate(value){
        this.$emit('interface', value)
      }
    },
    computed: {

    },
    sockets :{

    }
}
</script>

<style scoped lang="scss">
 
</style>
