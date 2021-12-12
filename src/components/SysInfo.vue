<template>
  <v-row>
    <v-col cols=12 md=4>
      <v-card hover>
        <v-card-title class="title-img">
          OS
          <v-img
            :src="getOSIcon"
            contain
            max-height="120"
            max-width="120"
          ></v-img>
        </v-card-title>
        <v-card-text>
          <table>
            <tr v-for="item in os" :key="item.name">
              <td><b>{{item.name}}</b></td>
              <td class="table-value">{{item.value}}</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols=12 md=4>
      <v-card hover>
        <v-card-title class="title-img">
          Hardware
          <v-icon size=120> {{icons.mdiServer}} </v-icon>
        </v-card-title>
        <v-card-text>
          <table>
            <tr v-for="item in hardware" :key="item.name">
              <td><b>{{item.name}}</b></td>
              <td class="table-value">{{item.value}}</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols=12 md=4>
      <v-card hover>
        <v-card-title class="title-img">
          Network
          <v-icon size=120> {{getNetworkIcon}} </v-icon>
        </v-card-title>
        <v-card-text>
          <table>
            <tr v-for="item in network" :key="item.name">
              <td><b>{{item.name}}</b></td>
              <td class="table-value">{{item.value}}</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols=12 md=4>
      <v-card hover>
        <v-card-title class="title-img">
          Time
          <v-icon size=120> {{icons.mdiClockOutline}} </v-icon>
        </v-card-title>
        <v-card-text>
          <table>
            <tr v-for="item in time" :key="item.name">
              <td><b>{{item.name}}</b></td>
              <td class="table-value">{{item.value}}</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols=12 md=4>
      <v-card hover>
        <v-card-title class="title-img">
          Python
          <v-img
            :src="require('../assets/python.svg')"
            contain
            max-height="120"
            max-width="120"
          ></v-img>
        </v-card-title>
        <v-card-text>
          <table>
            <tr v-for="item in python" :key="item.name">
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
    icons: {
      mdiWifiStrength3,
      mdiLanPending,
      mdiClockOutline,
      mdiServer
    },
    os: [
      {name: "Family:", value: "Linux"},
      {name: "Name:", value: "Manjaro"},
      {name: "Version:", value: "12.1"},
      {name: "Kernel:", value: "5.15.5"},
    ],
    hardware: [
      {name: "CPU:", value: "AMD Ryzen 5 5600X (12) @ 3.700GHz"},
      {name: "GPU:", value: "AMD ATI Radeon 540/540X/550/550X / RX 540X/550/550X"},
      {name: "Memory:", value: "16010 MiB"},
    ],
    network: [
      {name: "Type:", value: "WiFi"},
      {name: "Hostname:", value: "PiHomeServer"},
      {name: "IPv4:", value: "192.168.1.3"},
      {name: "IPv6:", value: "ладно, не могу придумать"},
    ],
    time: [
      {name: "Time on server:", value: "12:57"},
      {name: "Server timezone:", value: "Europe/Moscow"},
      {name: "Uptime:", value: "2 days, 08:43:22"},
    ],
    python: [
      {name: "Version:", value: "3.10.1"},
      {name: "PIP Version:", value: "2.14.2"},
      {name: "Venv:", value: "Not used"},
    ],
  }),

  computed: {
    getNetworkIcon: function() {
      return this.network[0].value == 'Ethernet' ? this.icons.mdiLanPending : this.icons.mdiWifiStrength3
    },
    getOSIcon: function() {
      switch (this.os[0].value) {
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
