import Vue from 'vue'
import routes from './routes'
import App from "./App.vue"
 import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

export const SocketInstance = io('http://localhost:3000');

Vue.use(VueSocketIO, 'http://localhost:3000')



new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || App
    }
  },
  render (h) { return h(this.ViewComponent) }
  
})
