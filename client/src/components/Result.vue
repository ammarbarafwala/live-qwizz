<template lang="html">

  <section class="result">
    <h2>Results</h2>
    <p>Correct Answer: <span class="capitalize">{{question.answer}}</span></p>
       <h3> Players and their choices</h3>
        <ul>
          <li>
            {{result.a}} Player(s) selected A: {{question.options.a}}
          </li>
          <li>
            {{result.b}} Player(s) selected B: {{question.options.b}}
          </li>
          <li>
            {{result.c}} Player(s) selected C: {{question.options.c}}
          </li>
        </ul>
  </section>

</template>

<script lang="js">
  export default  {
    name: 'Result',
    props: ['result', 'question'],
    mounted() {

    },
    data() {
      return {

      }
    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
  .capitalize {
      text-transform: capitalize;
  }

  h2 {
    text-align:center;
  }

  li{ 
  display:block;
  }
</style>
