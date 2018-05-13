<template>
  <div id="app">
    <app/>
    This is the Admin page
  </div>
</template>

<script>
import App from "../App.vue";
export default {

  name: 'admin',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components : {
    App
  }
}
</script>