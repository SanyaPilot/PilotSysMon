<template>
  <div>
    <v-row v-for="(iface, name) in ifaces" :key="name">
      <v-col cols=12 md=4>
        <v-card hover>
          <v-card-title>{{ name }} Info</v-card-title>
          <v-card-text class="pb-0">
            <div v-for="(data, name) in iface" :key="name" class="pb-4">
              <div class="text-subtitle-1">
                {{ name }}
              </div>
              <table v-if="name != 'MAC'">
                <tr v-for="(value, name) in data" :key="name">
                  <td><b>{{ name }}</b></td>
                  <td style="padding-left: 10px;">{{ value }}</td>
                </tr>
              </table>
              <span v-else>{{ data }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols=12 md=8>
        <v-card hover>
          <v-card-title>{{ name }} Bandwidth</v-card-title>
          <v-card-text>
            <div>
              <line-chart style="height:286px;" :chart-data="charts[name]" :options="chartOptions"></line-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
//import { getInterfaceAddressesData, getHostname, getActiveInterface } from '../API/network.js'
import { getInterfaceAddressesData, startMeasuring, stopMeasuring, getMeasuringResults, getHostname } from '../API/network.js'
import LineChart from '../charts/lineChart.js'
import colors from 'vuetify/lib/util/colors'

let updateTimer

export default {
  name: 'NetworkInfo',

  components: {
    LineChart
  },

  data: () => ({
    hostname: null,
    ifaces: null,
    charts: {
      lo: {}
    },
    usages: {},
    timestamps: [],
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Bandwidth'
          },
          ticks: {
            min: 0,
            suggestedMax: null,
            callback: value => {
              return value + ' MiB/s'
            }
          }
        }]
      }
    }
  }),
  async created() {
    await this.getIfacesInfo()
    this.hostname = await getHostname()
  },
  async activated() {
    try {
      await startMeasuring()
    } catch {
      console.log('Measuring is already running, skipping start')
    }
    let context = this
    updateTimer = setInterval(async function() {
      await context.updateUsagesData()
      await context.updateCharts()
    }, 1000)
  },
  async deactivated() {
    try {
      await stopMeasuring()
    } catch {
      console.log('Measuring is already stopped, skipping stop')
    }
    clearInterval(updateTimer)
  },
  methods: {
    async getIfacesInfo() {
      const info = await getInterfaceAddressesData()
      this.ifaces = {}
      for (const [ifaceName, data] of Object.entries(info)) {
        this.ifaces[ifaceName] = {}
        if (data.v4) {
          this.ifaces[ifaceName].IPv4 = {
            'Address': data.v4.address,
            'Netmask': data.v4.netmask,
            'Broadcast': data.v4.broadcast,
          }
        }
        if (data.v6) {
          this.ifaces[ifaceName].IPv6 = {
            'Address': data.v6.address,
            'Netmask': data.v6.netmask,
            'Broadcast': data.v6.broadcast,
          }
        }
        this.ifaces[ifaceName].MAC = data.mac
      }
    },
    async updateUsagesData() {
      let usage
      try {
        usage = await getMeasuringResults()
      } catch {
        console.error('Measuring thread is dead, restarting...')
        await startMeasuring()
        return
      }

      if (this.timestamps.length == 10){
        this.timestamps.shift()
      }
      this.timestamps.push(Date.now())

      for (const [ifaceName, data] of Object.entries(usage)) {
        if (!this.usages[ifaceName]){
          this.usages[ifaceName] = {download: [], upload: []}
        }
        if (this.usages[ifaceName].download.length == 10) {
          this.usages[ifaceName].download.shift()
          this.usages[ifaceName].upload.shift()
        }
        this.usages[ifaceName].download.push(parseFloat((data.recv / 1024 / 1024).toFixed(2)))
        this.usages[ifaceName].upload.push(parseFloat((data.sent / 1024 / 1024).toFixed(2)))
      }
    },
    async updateCharts() {
      let timestamps = []
      this.timestamps.forEach((item) => timestamps.push(new Date(item).toLocaleTimeString()))
      for (const [ifaceName, data] of Object.entries(this.usages)) {
        this.charts[ifaceName] = {
          labels: timestamps,
          datasets: [
            {
              label: 'Download',
              fill: false,
              tension: 0.1,
              pointBackgroundColor: this.$vuetify.theme.themes.light.primary,
              borderColor: this.$vuetify.theme.themes.light.primary,
              data: data.download
            },
            {
              label: 'Upload',
              fill: false,
              tension: 0.1,
              pointBackgroundColor: colors.red.darken1,
              borderColor: colors.red.darken1,
              data: data.upload
            }
          ]
        }
      }
    }
  }
}
</script>

<style>

</style>
