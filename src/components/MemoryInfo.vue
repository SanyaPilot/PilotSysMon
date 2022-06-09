<template>
  <div>
    <panel-header>System memory info</panel-header>
    <v-row>
      <v-col cols=12 lg=4>
        <v-row>
          <v-col xs=12 md=6 lg=12>
            <v-card hover>
              <v-card-title>RAM Load</v-card-title>
              <v-card-text class="d-flex justify-space-between">
                <v-progress-circular
                  size=300
                  width=15
                  rotate=180
                  :value="ram.percents.at(-1)"
                  color="primary"
                  style="margin-right:10px;"
                >
                  <span style="font-size: 3rem">{{ ram.percents.at(-1) }} %</span>
                </v-progress-circular>
                <table class="memory-table">
                  <tr v-for="(value, name) in ramInfo" :key="name">
                    <td><b>{{ name }}</b></td>
                    <td style="padding-left: 10px;">{{ value }}</td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col xs=12 md=6 lg=12 v-if="swapInfo">
            <v-card hover>
              <v-card-title>Swap Load</v-card-title>
              <v-card-text class="d-flex justify-space-between">
                <v-progress-circular
                  size=300
                  width=15
                  rotate=180
                  :value="swap.percents.at(-1)"
                  color="primary"
                  style="margin-right:10px;"
                >
                  <span style="font-size: 3rem">{{ swap.percents.at(-1) }} %</span>
                </v-progress-circular>
                <table class="memory-table">
                  <tr v-for="(value, name) in swapInfo" :key="name">
                    <td><b>{{ name }}</b></td>
                    <td style="padding-left: 10px;">{{ value }}</td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols=12 lg=8>
        <v-row>
          <v-col cols=12>
            <v-card hover>
              <v-card-title>
                RAM load chart
              </v-card-title>
              <v-card-text>
                <div v-if="ramChart.datacollection">
                  <line-chart style="height:300px;" :chart-data="ramChart.datacollection" :options="ramChart.options"></line-chart>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols=12 v-if="swapInfo">
            <v-card hover>
              <v-card-title>
                Swap load chart
              </v-card-title>
              <v-card-text>
                <div v-if="swapChart.datacollection">
                  <line-chart style="height:300px;" :chart-data="swapChart.datacollection" :options="swapChart.options"></line-chart>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import getMemoryData from '../API/memory.js'
import LineChart from '../charts/lineChart.js'
import PanelHeader from './import/PanelHeader.vue'

let updateTimer

export default {
  name: 'MemoryInfo',

  components: {
    LineChart,
    PanelHeader
  },

  data: () => ({
    ramInfo: {},
    swapInfo: null,
    ram: {
      usages: [],
      percents: [],
      timestamps: []
    },
    swap: {
      usages: [],
      percents: [],
      timestamps: []
    },
    ramChart: {
      datacollection: null,
      options: {
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
              labelString: 'RAM Used '
            },
            ticks: {
              min: 0,
              max: null,
              callback: null
            }
          }]
        }
      }
    },
    swapChart: {
      datacollection: null,
      options: {
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
              labelString: 'Swap Used '
            },
            ticks: {
              min: 0,
              max: null,
              callback: null
            }
          }]
        }
      }
    }
  }),
  async created() {
    await this.updateData()
    this.updateRAMChart()
    if (this.swapInfo) {
      this.updateSwapChart()
    }
  },
  async activated() {
    let context = this
    updateTimer = setInterval(async function() {
      await context.updateData()
      context.updateRAMChart()
      if (context.swapInfo) {
        context.updateSwapChart()
      }
    }, 1000)
  },
  deactivated() {
    clearInterval(updateTimer)
  },
  methods: {
    async updateData() {
      const response = await getMemoryData(true)
      Object.entries(response.ram).map(entry => {
        if (entry[1]) {
          this.ramInfo[entry[0].substr(0, 1).toUpperCase() + entry[0].slice(1)] = entry[1]
        }
      })
      if (this.ram.usages.length == 10) {
        this.ram.usages.shift()
        this.ram.percents.shift()
        this.ram.timestamps.shift()
      }

      const cur = parseFloat(response.ram.used)
      this.ram.usages.push(cur <= parseFloat(response.ram.total) ? cur : (cur / 1024))
      this.ram.percents.push(response.ram.percent)
      this.ram.timestamps.push(Date.now())
      if (response.swap != null) {
        this.swapInfo = {}
        Object.entries(response.swap).map(entry => {
          this.swapInfo[entry[0].substr(0, 1).toUpperCase() + entry[0].slice(1)] = entry[1]
        })
        if (this.swap.usages.length == 10) {
          this.swap.usages.shift()
          this.swap.percents.shift()
          this.swap.timestamps.shift()
        }
        this.swap.usages.push(parseFloat(response.swap.used))
        this.swap.percents.push(response.swap.percent)
        this.swap.timestamps.push(Date.now())
      } else {
        this.swapInfo = null
      }
    },
    updateRAMChart() {
      let timestamps = []
      this.ram.timestamps.forEach((item) => timestamps.push(new Date(item).toLocaleTimeString()))
      this.ramChart.options.scales.yAxes[0].ticks.max = parseFloat(this.ramInfo.Total)
      let context = this
      this.ramChart.options.scales.yAxes[0].ticks.callback = function(value) {
                return value + context.ramInfo.Total.at(-1);
              }
      this.ramChart.datacollection = {
        labels: timestamps,
        datasets: [
          {
            label: 'RAM Load',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: this.$vuetify.theme.themes.light.primary,
            borderColor: this.$vuetify.theme.themes.light.primary,
            data: this.ram.usages
          },
        ]
      }
    },
    updateSwapChart() {
      let timestamps = []
      this.swap.timestamps.forEach((item) => timestamps.push(new Date(item).toLocaleTimeString()))
      this.swapChart.options.scales.yAxes[0].ticks.max = parseFloat(this.swapInfo.Total)
      let context = this
      this.swapChart.options.scales.yAxes[0].ticks.callback = function(value) {
                return value + context.swapInfo.Total.at(-1);
              }
      this.swapChart.datacollection = {
        labels: timestamps,
        datasets: [
          {
            label: 'Swap Load',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: this.$vuetify.theme.themes.light.primary,
            borderColor: this.$vuetify.theme.themes.light.primary,
            data: this.swap.usages
          },
        ]
      }
    }
  }
}
</script>

<style>
.memory-table {
  padding-left: 16px;
  align-self: center;
}
</style>
