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
  export default  {
    
    name: 'question',
    props: ['q', 'user'],
    mounted() {

    },
    data() {
      return {

      }
    },
    methods: {
      validate(index){
        console.log("yes")
        this.$socket.emit("validate", index, this.user)
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
