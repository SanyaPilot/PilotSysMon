// Vue stuff
import Vue from 'vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'

// Components
import App from './App.vue'
import SysInfo from './components/SysInfo.vue'
import BarItem from './components/bar.vue'

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/', redirect: '/sysinfo' },
  { path: '/sysinfo', component: SysInfo },
  { path: '/bar', component: BarItem }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
