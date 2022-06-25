// Vue stuff
import Vue from 'vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'

// Translation support
import i18n from './i18n'

// Components
import App from './App.vue'
import SysInfo from './components/SysInfo.vue'
import CPUInfo from './components/CPUInfo.vue'
import DisksInfo from './components/DisksInfo.vue'
import MemoryInfo from './components/MemoryInfo.vue'
import NetworkInfo from './components/NetworkInfo.vue'
import LogsInfo from './components/LogsInfo.vue'
import SettingsPanel from './components/SettingsPanel.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/', redirect: '/sysinfo' },
  { path: '/sysinfo', name: 'sysinfo', component: SysInfo },
  { path: '/cpu', name: 'cpu', component: CPUInfo },
  { path: '/disks', name: 'disks', component: DisksInfo },
  { path: '/memory', name: 'memory', component: MemoryInfo },
  { path: '/network', name: 'network', component: NetworkInfo },
  { path: '/logs', name: 'logs', component: LogsInfo },
  { path: '/settings', name: 'settings', component: SettingsPanel }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
