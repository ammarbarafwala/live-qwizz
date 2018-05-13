<template lang="html">

  <section class="result">
    <h2>Results</h2>
    <div>Number of users who got it right: <span>{{results.correct}}</span></div>
    <div>Number of users who got it wrong: <span>{{results.wrong}}</span></div>
  </section>

</template>

<script lang="js">
  export default  {
    name: 'result',
    props: ['results'],
    mounted() {

    },
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
  .result {

  }
</style>
