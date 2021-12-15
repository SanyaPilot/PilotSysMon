<template>
  <v-row>
    <v-col cols=12 md=4 v-for="(card, name) in cards" :key="name">
      <v-card hover>
        <v-card-title class="title-img">
          {{card.label}}
          <v-img
            v-if="card.iconType == 'svg'"
            :src="card.icon == 'os' ? getOSIcon : card.icon"
            contain
            max-height="120"
            max-width="120"
          ></v-img>
          <v-icon v-else size=120> {{card.icon == 'network' ? getNetworkIcon : card.icon}} </v-icon>
        </v-card-title>
        <v-card-text>
          <table>
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

export default {
  name: 'SysInfo',

  data: () => ({
    cards: {
      os: {label: "OS", iconType: "svg", icon: "os", data: [
        {name: "Family:", value: "Linux"},
        {name: "Name:", value: "Manjaro"},
        {name: "Version:", value: "12.1"},
        {name: "Kernel:", value: "5.15.5"},
      ]},
      hardware: {label: "Hardware", iconType: "icon", icon: mdiServer, data: [
        {name: "CPU:", value: "AMD Ryzen 5 5600X (12) @ 3.700GHz"},
        {name: "GPU:", value: "AMD ATI Radeon 540/540X/550/550X / RX 540X/550/550X"},
        {name: "Memory:", value: "16010 MiB"},
      ]},
      network: {label: "Network", iconType: "icon", icon: "network", data: [
        {name: "Type:", value: "WiFi"},
        {name: "Hostname:", value: "PiHomeServer"},
        {name: "IPv4:", value: "192.168.1.3"},
        {name: "IPv6:", value: "ладно, не могу придумать"},
      ]},
      time: {label: "Time", iconType: "icon", icon: mdiClockOutline, data: [
        {name: "Time on server:", value: "12:57"},
        {name: "Server timezone:", value: "Europe/Moscow"},
        {name: "Uptime:", value: "2 days, 08:43:22"},
      ]},
      python: {label: "Python", iconType: "svg", icon: require('../assets/python.svg'), data: [
        {name: "Version:", value: "3.10.1"},
        {name: "PIP Version:", value: "2.14.2"},
        {name: "Venv:", value: "Not used"},
      ]},
    },
  }),
  computed: {
    getNetworkIcon: function() {
      return this.cards.network.data[0].value == 'Ethernet' ? mdiLanPending : mdiWifiStrength3
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
    }
  }
};
</script>

<style>
.title-img {
  justify-content: space-between;
}
table {
  border-spacing: 0px;
  border-style: none;
  width: 100%;
}
.table-value {
  text-align: right;
}
</style>
