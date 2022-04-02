// Vue stuff
import Vue from 'vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'

// Components
import App from './App.vue'
import SysInfo from './components/SysInfo.vue'
import CPUInfo from './components/CPUInfo.vue'
import DisksInfo from './components/DisksInfo.vue'
import MemoryInfo from './components/MemoryInfo.vue'
import NetworkInfo from './components/NetworkInfo.vue'

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/', redirect: '/sysinfo' },
  { path: '/sysinfo', name: 'sysinfo', component: SysInfo },
  { path: '/cpu', name: 'cpu', component: CPUInfo },
  { path: '/disks', name: 'disks', component: DisksInfo },
  { path: '/memory', name: 'memory', component: MemoryInfo },
  { path: '/network', name: 'network', component: NetworkInfo }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
