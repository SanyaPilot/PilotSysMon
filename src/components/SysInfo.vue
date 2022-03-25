<template>
  <v-row>
    <v-col cols=12 md=4 v-for="(card, name) in cards" :key="name">
      <v-card hover>
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
</template>

<script>
import { mdiWifiStrength3, mdiLanPending, mdiClockOutline, mdiServer } from '@mdi/js'

import getOSData from '../API/os.js'
import { getCPUSummaryData } from '../API/cpu.js'
import getMemoryData from '../API/memory.js'
import { getInterfaceAddressesData, getActiveInterface, getHostname } from '../API/network.js'
import getTimeData from '../API/time.js'
import getPythonData from '../API/python.js'

export default {
  name: 'SysInfo',

  data: () => ({
    cards: {
      os: {label: "OS", iconType: "svg", icon: "os", data: null},
      hardware: {label: "Hardware", iconType: "icon", icon: mdiServer, data: null},
      network: {label: "Network", iconType: "icon", icon: "network", data: null},
      time: {label: "Time", iconType: "icon", icon: mdiClockOutline, data: null},
      python: {label: "Python", iconType: "svg", icon: require('../assets/python.svg'), data: null},
    },
  }),
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
        default:
          return null
      }
    },
  },
  methods: {
    async updateOSData() {
      const data = await getOSData()
      let payload
      switch (data.family){
        case "Linux":
          payload = [
            {name: "Family:", value: data.family},
            {name: "Name:", value: data.name}
          ]
          if (data.version){
            payload.push({name: "Version:", value: data.version})
          }
          payload.push({name: "Kernel:", value: data.release})
          if (data.url){
            payload.push({name: "URL:", value: data.url})
          }
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
        {name: "CPU:", value: cpu.name + " (" + cpu.cpus.count + ") @ " + cpu.freq.max + "MHz"},
        {name: "Memory:", value: ram.used + " / " + ram.total},
        {name: "Swap:", value: swap.used + " / " + swap.total},
      ]
    },
    async updateNetworkData() {
      const data = await getInterfaceAddressesData()
      const activeIface = await getActiveInterface()
      const addresses = Object.getOwnPropertyDescriptor(data, activeIface.name).value
      const hostname = await getHostname()
      this.cards.network.data = [
        {name: "Interface:", value: activeIface.name +
        " (" + (activeIface.type == "wifi" ? "WiFi" : "Ethernet") + ")"},
        {name: "Hostname:", value: hostname},
        {name: "IPv4:", value: addresses.v4.address},
        {name: "IPv6:", value: addresses.v6 ? addresses.v6.address : "Not used"},
      ]
    },
    async updateTimeData() {
      const data = await getTimeData()
      const d = new Date(data.uptime * 1000)
      const day = d.getUTCDate()
      console.log(data);
      this.cards.time.data = [
        {name: "Time on server:", value: new Date(data.time * 1000).toLocaleTimeString('ru-RU', {timeZone: 'UTC'})},
        {name: "Server timezone:", value: data.timezone},
        {name: "Uptime:", value: (day - 1) + (day == 1 ? " day" : " days") +
                          ", " + d.getUTCHours() + ":" + d.getUTCMinutes() +
                          ":" + d.getUTCSeconds()},
      ]
    },
    async updatePythonData() {
      const python = await getPythonData()
      this.cards.python.data = [
        {name: "Implementation:", value: python.implementation},
        {name: "Version:", value: python.version},
        {name: "Venv:", value: python.venv_path ? python.venv_path : "Not used"},
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
};
</script>

<style>
.title-img {
  justify-content: space-between;
}
.data-table {
  border-spacing: 0px;
  border-style: none;
  width: 100%;
}
.table-value {
  text-align: right;
}
</style>
