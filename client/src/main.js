// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import store from './store'
import filter from './filter'
import directive from './directive'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-default/reset.css'

Vue.config.productionTip = false
Vue.use(filter)
Vue.use(directive)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.$http = axios

if (!window.localStorage.getItem('_sessionId')) {
  const s = 'ABCDEFGHIJKLMN'
  const a2f = s => f => i => s[f(i)]
  const randomChar = length => () => Math.floor(Math.random() * 1000) % length
  const randomString = Array.prototype.map.call(s, a2f(s)(randomChar(s.length))).join('')
  window.localStorage.setItem('_sessionId', randomString)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
