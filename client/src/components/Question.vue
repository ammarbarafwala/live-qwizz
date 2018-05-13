<template lang="html">

  <section class="question">
    <h1>{{q.question}}?</h1>
      <ul>
        <li v-for="(value, index) in q.options" @click="validate(index)" v-bind:class="{ 'blue-background': user.answer == index}">
            <span class="option">{{index}}:</span><span class="answer">{{value}}</span>
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
        validating:false
      }
    },
    methods: {
      validate(index){
        this.$emit('interface', index)
      }
    }
}
</script>

<style scoped lang="scss">
 .blue-background {
   background: hsl(315, 60%, 80%)
 }

 li {
   display: block;
   padding:5px;
   cursor:pointer;
   border-bottom:1px solid gray;
 }

 h1{
   text-align: center;
 }

 ul {
   text-align:justify;
    width:35%;
 }


 .option {
   text-transform: capitalize;
   padding:3px;
  margin-right:10px;
 }


 .question{
  padding:2px 10px;
 }

</style>
