<template>
  <div>
    <v-row>
      <v-col cols=12 sm=6 md=3>
        <v-row>
          <v-col cols=12>
            <v-card hover>
              <v-card-title class="justify-space-between">
                {{ cpuName }}
                <!--<v-img
                  v-if="card.iconType == 'svg'"
                  :src="card.icon == 'os' ? getOSIcon : card.icon"
                  contain
                  max-height="120"
                  max-width="120"
                ></v-img>
                <v-icon v-else size=120> {{card.icon == 'network' ? getNetworkIcon : card.icon}} </v-icon>-->
              </v-card-title>
              <v-card-text class="d-flex justify-space-around">
                <v-progress-circular
                  size=160
                  width=15
                  rotate=180
                  :value="load.average.at(-1)"
                  color="primary"
                >
                  <span style="font-size: 1.75rem">{{ load.average.at(-1) }} %</span>
                </v-progress-circular>
                <table class="side-table">
                  <tr v-for="item in sysload" :key="item.name">
                    <td><b>{{item.name}}</b></td>
                    <td class="table-value">{{item.value}}</td>
                  </tr>
                </table>
              </v-card-text>
              <v-card-text class="pt-0">
                <v-spacer/>
                <div v-for="i in cpu.threads" :key="i" class="py-1">
                  <div class="d-flex justify-space-between">
                    <span>Core {{i}}</span><span>{{ load.perCPU[i - 1] }}%</span>
                  </div>
                  <v-progress-linear :value="load.perCPU[i - 1]"></v-progress-linear>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols=12 v-if="$vuetify.breakpoint.md">
            <CPUDetails :data="details"/>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols=12 sm=6 md=9>
        <v-row>
          <v-col cols=12 md=6>
            <v-card hover>
              <v-card-title class="justify-space-between">
                CPU load chart
              </v-card-title>
              <v-card-text>
                <div class="chart">
                  <line-chart :chart-data="loadChart.datacollection" :options="loadChart.options"></line-chart>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols=12 md=6>
            <v-card hover>
              <v-card-title class="justify-space-between">
                CPU frequency chart
              </v-card-title>
              <v-card-text>
                <div class="chart">
                  <line-chart :chart-data="freqChart.datacollection" :options="freqChart.options"></line-chart>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols=12 md="auto" v-if="!$vuetify.breakpoint.md">
        <CPUDetails :data="details"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
//import { mdiWifiStrength3, mdiLanPending, mdiClockOutline, mdiServer } from '@mdi/js'
import LineChart from '../charts/lineChart.js'
import CPUDetails from './import/CPUDetails.vue'
import { getCPUSummaryData, getCPUInfoData } from '../API/cpu.js'

export default {
  name: 'SysInfo',

  components: {
    LineChart,
    CPUDetails
  },

  data: () => ({
    loadChart: {
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
              labelString: 'Load'
            },
            ticks: {
              min: 0,
              max: 100,
              callback: function(value) {
                return value + '%';
              }
            }
          }]
        }
      }
    },
    freqChart: {
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
              labelString: 'Frequency'
            },
            ticks: {
              suggestedMin: null,
              suggestedMax: null,
              callback: function(value) {
                return value + 'MHz';
              }
            }
          }]
        }
      }
    },
    sysload: [
      {name: 'Average 1 min:', value: "N/A"},
      {name: 'Average 5 min:', value: "N/A"},
      {name: 'Average 15 min:', value: "N/A"},
    ],
    details: [],
    cpuName: null,
    load: {
      average: [],
      perCPU: [],
      timestamps: []
    },
    freq: {
      min: null,
      max: null,
      average: [],
      perCPU: [],
      timestamps: []
    },
    cpu: {
      cores: 6,
      threads: 12
    }
  }),
  async created() {
    let context = this
    await this.updateCPUInfoData()
    setInterval(async function() {
      await context.updateCPUSummaryData()
      context.updateLoadChart()
      context.updateFreqChart()
    }, 1000)
  },
  methods: {
    updateLoadChart () {
      let timestamps = []
      this.load.timestamps.forEach((item) => timestamps.push(new Date(item).toLocaleTimeString()))
      this.loadChart.datacollection = {
        labels: timestamps,
        datasets: [
          {
            label: 'CPU Load',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: this.$vuetify.theme.themes.light.primary,
            borderColor: this.$vuetify.theme.themes.light.primary,
            data: this.load.average
          },
        ]
      }
    },
    updateFreqChart () {
      let timestamps = []
      this.freq.timestamps.forEach((item) => timestamps.push(new Date(item).toLocaleTimeString()))
      this.freqChart.options.scales.yAxes[0].ticks.suggestedMin = this.freq.min
      this.freqChart.options.scales.yAxes[0].ticks.suggestedMax = this.freq.max
      this.freqChart.datacollection = {
        labels: timestamps,
        datasets: [
          {
            label: 'CPU Frequency',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: this.$vuetify.theme.themes.light.primary,
            borderColor: this.$vuetify.theme.themes.light.primary,
            data: this.freq.average
          },
        ]
      }
    },
    getHumanTime() {
      const date = new Date()
      return date.toLocaleTimeString()
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    async updateCPUSummaryData() {
      const cpu = await getCPUSummaryData()
      this.cpuName = cpu.name
      if (this.load.average.length == 10) {
        this.load.average.shift()
        this.load.timestamps.shift()
      }
      this.load.average.push(cpu.load_percent.current)
      this.load.perCPU = cpu.load_percent.per_cpu
      this.load.timestamps.push(Date.now())
      this.sysload = [
        {name: 'Average 1 min:', value: cpu.load[0]},
        {name: 'Average 5 min:', value: cpu.load[1]},
        {name: 'Average 15 min:', value: cpu.load[2]},
      ]

      if (this.freq.average.length == 10) {
        this.freq.average.shift()
        this.freq.timestamps.shift()
      }
      this.freq.min = cpu.freq.min
      this.freq.max = cpu.freq.max
      this.freq.average.push(cpu.freq.current)
      this.freq.perCPU = cpu.freq.per_cpu
      this.freq.timestamps.push(Date.now())
    },
    async updateCPUInfoData() {
      const cpu = await getCPUInfoData()
      if (typeof(cpu) == "number") {
        this.details = null
      }
      Object.entries(cpu).map(entry => {
        if (entry[0] != "name" && entry[0] != "cpus" && entry[0] != "arch"){
          if (entry[1] != null){
            const len = entry[0].substr(0, 3) == 'cpu' ? 3 : 1
            this.details.push({name: (entry[0].substr(0, len).toUpperCase() + entry[0].slice(len)).replace(/_/g, ' '), value: entry[1]})
          }
        }
      })
    }
  }
};
</script>

<style>
.chart {
  max-height: 400px;
}
.data-table {
  border-spacing: 0px;
  border-style: none;
  width: 100%;
}
.side-table {
  width: auto;
  padding-left: 16px;
  align-self: center;
}
.table-value {
  padding-left: 6px;
  text-align: right;
}
.table-value-name {
  width: 5rem
}
</style>
