<template>
  <div>
    <v-row>
      <v-col cols=12 md=6 lg=4 v-for="(card, name) in cards" :key="name">
        <v-card
          :hover="!$vuetify.breakpoint.mobile"
          :outlined="$vuetify.breakpoint.mobile"
          class="d-flex flex-wrap"
          style="height: 100%;"
        >
          <v-card-title class="title-img">
            {{card.label}}
            <v-img
              v-if="card.data && card.iconType == 'svg'"
              :src="card.icon == 'os' ? getOSIcon : card.icon"
              contain
              max-height="120"
              max-width="120"
            ></v-img>
            <v-icon v-else-if="card.data" size=120> {{card.icon == 'network' ? getNetworkIcon : card.icon}} </v-icon>
          </v-card-title>
          <v-card-text v-if="card.data">
            <table class="data-table">
              <tr v-for="item in card.data" :key="item.name">
                <td><b>{{item.name}}</b></td>
                <td class="table-value">{{item.value}}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiWifiStrength3, mdiLanPending, mdiClockOutline, mdiServer } from '@mdi/js'

import getOSData from '../API/os.js'
import { getCPUSummaryData } from '../API/cpu.js'
import getMemoryData from '../API/memory.js'
import { getInterfaceAddressesData, getActiveInterface, getHostname } from '../API/network.js'
import getTimeData from '../API/time.js'
import getPythonData from '../API/python.js'

let updateTimer

export default {
  name: 'SysInfo',

  data: function() {
    return {
      cards: {
        os: {label: this.$t('sysinfo.os.header'), iconType: "svg", icon: "os", data: null},
        hardware: {label: this.$t('sysinfo.hardware.header'), iconType: "icon", icon: mdiServer, data: null},
        network: {label: this.$t('sysinfo.network.header'), iconType: "icon", icon: "network", data: null},
        time: {label: this.$t('sysinfo.time.header'), iconType: "icon", icon: mdiClockOutline, data: null},
        python: {label: this.$t('common.python'), iconType: "svg", icon: require('../assets/python.svg'), data: null},
      },
    }
  },
  computed: {
    getNetworkIcon: function() {
      return this.cards.network.data[0].value.includes('Ethernet') ? mdiLanPending : mdiWifiStrength3
    },
    getOSIcon: function() {
      switch (this.cards.os.data[0].value) {
        case 'Linux':
          return require('../assets/linux.svg')
        case 'Windows':
          return require('../assets/windows.svg')
        case 'macOS':
          return require('../assets/macOS.svg')
        default:
          return null
      }
    },
  },
  methods: {
    async updateOSData() {
      const data = await getOSData()
      let payload
      payload = [{name: this.$t('sysinfo.os.family'), value: data.family}]
      switch (data.family) {
        case "Linux":
          payload.push({name: this.$t('sysinfo.os.name'), value: data.name})
          if (data.version){
            payload.push({name: this.$t('sysinfo.os.version'), value: data.version})
          }
          payload.push({name: this.$t('sysinfo.os.kernel'), value: data.release})
          if (data.url){
            payload.push({name: this.$t('sysinfo.os.url'), value: data.url})
          }
          break

        case "Windows":
          payload.push({name: this.$t('sysinfo.os.release'), value: data.release})
          payload.push({name: this.$t('sysinfo.os.build'), value: data.build})
          payload.push({name: this.$t('sysinfo.os.edition'), value: data.edition})
          break

        default:
          payload.push({name: this.$t('sysinfo.os.version'), value: data.release})
          payload.push({name: this.$t('sysinfo.os.release'), value: data.build})
          break

      }

      this.cards.os.data = payload
    },
    async updateHardwareData() {
      const cpu = await getCPUSummaryData()
      const memory = await getMemoryData(true)
      const ram = memory.ram
      const swap = memory.swap
      this.cards.hardware.data = [
        {name: this.$t('sysinfo.hardware.cpu'), value: cpu.name + " (" + cpu.cpus.count + ") @ " + cpu.freq.max + "MHz"},
        {name: this.$t('sysinfo.hardware.ram'), value: ram.used + " / " + ram.total},
        {name: this.$t('sysinfo.hardware.swap'), value: swap.used + " / " + swap.total},
      ]
    },
    async updateNetworkData() {
      const data = await getInterfaceAddressesData()
      const activeIface = await getActiveInterface()
      const addresses = Object.getOwnPropertyDescriptor(data, activeIface.name).value
      const hostname = await getHostname()
      this.cards.network.data = [
        {name: this.$t('sysinfo.network.iface'), value: activeIface.name +
        " (" + (activeIface.type == "wifi" ? this.$t('sysinfo.network.wifi') : this.$t('sysinfo.network.eth')) + ")"},
        {name: this.$t('sysinfo.network.hostname'), value: hostname},
        {name: this.$t('common.ipv4'), value: addresses.v4.address},
        {name: this.$t('common.ipv6'), value: addresses.v6 ? addresses.v6.address : "Not used"},
      ]
    },
    async updateTimeData() {
      const data = await getTimeData()
      const d = new Date(data.uptime * 1000)
      const day = d.getUTCDate()
      console.log(data);
      this.cards.time.data = [
        {name: this.$t('sysinfo.time.serverTime'), value: new Date(data.time * 1000).toLocaleTimeString('ru-RU', {timeZone: 'UTC'})},
        {name: this.$t('sysinfo.time.serverTZ'), value: data.timezone},
        {name: this.$t('sysinfo.time.uptime'), value: (day - 1) + (day == 1 ? " day" : " days") +
                          ", " + d.getUTCHours() + ":" + d.getUTCMinutes() +
                          ":" + d.getUTCSeconds()},
      ]
    },
    async updatePythonData() {
      const python = await getPythonData()
      this.cards.python.data = [
        {name: this.$t('sysinfo.python.implementation'), value: python.implementation},
        {name: this.$t('common.version'), value: python.version},
        {name: this.$t('sysinfo.python.venv'), value: python.venv_path ? python.venv_path : "Not used"},
      ]
    }
  },

  async created() {
    await this.updateOSData()
    await this.updateHardwareData()
    await this.updateNetworkData()
    await this.updateTimeData()
    await this.updatePythonData()
  },
  async activated() {
    updateTimer = setInterval(async function() {
      await this.updateHardwareData()
      await this.updateNetworkData()
      await this.updateTimeData()
    }.bind(this), 3000)
  },
  deactivated() {
    clearInterval(updateTimer)
  },
};
</script>

<style>
.title-img {
  justify-content: space-between;
  width: 100%;
  height: fit-content;
}
.data-table {
  border-spacing: 0px;
  border-style: none;
  width: 100%;
}
.table-value {
  text-align: right;
  overflow-wrap: anywhere;
}
</style>
