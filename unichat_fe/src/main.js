import Vue from 'vue'
import './js/http'
import './js/eventbus'
import './cache'
import './js/registerComponent'
import router from './router'
import store from './store'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
