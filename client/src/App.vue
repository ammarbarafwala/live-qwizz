<template>
  <div id="app">
    <ul>
      <li>
        <a href="/home">Home</a>
        <a href="/admin">Admin</a>
      </li>
    </ul>
    <Game />
  </div>
</template>

<script>
import Game from "./components/Game.vue";
import Admin from "./components/Admin.vue";

export default {
  name: 'app',
  components :{
    Admin,
    Game
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
