<template>
  <div>
    <panel-header>System logs</panel-header>
    <v-row>
      <v-col cols=12 md=3 class="py-1">
        <v-select
          label="Priority"
          hint="Messages with this priority will be displayed"
          v-model="loglevel"
          :items="loglevels"
          @change="updateLogs()"
          :disabled="loading"
          :hide-details="hideDetailsCheck"
          :menu-props="{ offsetX: true }"
        ></v-select>
      </v-col>
      <v-col cols=12 md=3 class="py-1">
        <v-text-field
          label="Identfier"
          hint="Logs with this ID will be displayed"
          v-model="id"
          :disabled="loading"
          @change="updateLogs()"
          :hide-details="hideDetailsCheck"
        ></v-text-field>
      </v-col>
      <v-col cols=12 md=2 class="py-1">
        <v-text-field
          label="Boot ID"
          hint="Logs of this boot will be displayed"
          v-model="boot"
          :rules="validateNumberRule"
          :disabled="loading"
          @change="updateLogs()"
          :hide-details="hideDetailsCheck"
        ></v-text-field>
      </v-col>
      <v-col cols=12 md=4 class="py-1">
        <v-menu

          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="localDate"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :hide-details="hideDetailsCheck"
            >
              <template v-slot:append-outer>
                <v-btn
                  small
                  outlined
                  @click="date = null; updateLogs()"
                >
                  Reset
                </v-btn>
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            range
            v-model="date"
            @input="checkDateArray(); updateLogs()"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-alert
      type="info"
      color="grey darken-4"
      style="
      width: fit-content;
      position: absolute;
      right: 20px;
      top: 20px;"
      transition="slide-x-reverse-transition"
      :value="loading">
      <div class="d-flex justify-space-between">
        Loading...
        <v-progress-circular
        indeterminate
        size=24
        class="ml-3"></v-progress-circular>
      </div>
    </v-alert>
    <div v-for="day in paginatedLogs[page - 1]" :key="day[0]">
      <h5 class="text-md-h5 text-h6 mt-3">{{ new Date(day[0] * 24 * 60 * 60 * 1000).toLocaleString(
        {}, {month: 'long', day: 'numeric', year:'numeric'}) }}</h5>
      <v-simple-table v-if="$vuetify.breakpoint.mdAndUp">
        <template v-slot:default>
          <colgroup>
            <col style="width: 56px">
            <col span=3>
          </colgroup>
          <tbody>
            <tr v-for="(msg, key) in day[1]" :key="key">
              <td><v-icon :color="getIconColor(msg.level)">
                {{ getIconName(msg.level) }}
              </v-icon></td>
              <td style="width: 0px" class="text--secondary">{{ msg.time }}</td>
              <td style="width: 0px" class="text--secondary">{{ msg.id }}</td>
              <td class="pl-6">{{ msg.message }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-simple-table v-else>
        <template v-slot:default>
          <colgroup>
            <col>
            <col span=2>
          </colgroup>
          <tbody>
            <tr v-for="(msg, key) in day[1]" :key="key">
              <td class="px-2"><v-icon :color="getIconColor(msg.level)">
                {{ getIconName(msg.level) }}
              </v-icon></td>
              <td style="width: 0px" class="px-2 text--secondary">
                {{ msg.time }}<br/>
                {{ msg.id }}
              </td>
              <td class="pl-3 pr-0">{{ msg.message }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import getLogsData from '../API/logs.js'
import PanelHeader from './import/PanelHeader.vue'

export default {
  name: 'LogsInfo',

  components: {
    PanelHeader
  },

  data: () => ({
    logdata: {},
    paginatedLogs: [],
    pageCount: null,
    page: 1,
    loglevels: [{text: 'Emergency', value: 'emerg'}, {text: 'Alert and above', value: 'alert'},
                {text: 'Critical and above', value: 'crit'}, {text: 'Error and above', value: 'error'},
                {text: 'Warning and above', value: 'warn'}, {text: 'Notice and above', value: 'notice'},
                {text: 'Info and above', value: 'info'}, {text: 'Debug and above', value: 'debug'}],
    loglevel: 'error',
    id: null,
    boot: 0,
    date: null,
    validateNumberRule: [value => Number.isInteger(parseInt(value)) || 'Must be a number!'],
    loading: false
  }),
  async created() {
    await this.updateLogs()
  },
  methods: {
    async getLog() {
      let tempData = new Map()
      let preResponse
      if (this.date && this.date.length == 1) {
        preResponse = await getLogsData(this.loglevel, this.id, this.boot,
          this.date[0], null, null)
      } else if (this.date) {
        preResponse = await getLogsData(this.loglevel, this.id, this.boot,
          null, this.date[0], this.date[1])
      } else {
        preResponse = await getLogsData(this.loglevel, this.id, this.boot,
          null, null, null)
      }

      const response = preResponse.reverse()

      response.forEach(item => {
        const date = new Date(item.time * 1000)

        let edited = item
        edited.time = date.toLocaleTimeString()

        const dayNumber = Math.floor(date.valueOf() / 1000 / 60 / 60 / 24)
        if (!(tempData.get(dayNumber))) {
          tempData.set(dayNumber, [])
        }
        tempData.set(dayNumber, [...tempData.get(dayNumber), edited])
      });
      this.logdata = tempData
    },
    paginateLog() {
      let totalLength = 0
      this.logdata.forEach(value => {
        totalLength += value.length
      })
      this.pageCount = Math.ceil(totalLength / 60)

      let toCopy = 0
      let paginated = []
      let tempMap = new Map()
      for (const [dayNumber, value] of this.logdata) {
        let msgs = value
        if (toCopy > 0) {
          tempMap.set(dayNumber, msgs.splice(0, toCopy))
          paginated.push(tempMap)
          toCopy = 0
          tempMap = new Map()
        }
        while (msgs.length > 0) {
          let spliced = msgs.splice(0, 60)
          tempMap.set(dayNumber, spliced)
          if (spliced.length == 60 || (this.logdata.size == 1 && spliced.length < 60)) {
            paginated.push(tempMap)
            tempMap = new Map()
          } else {
            toCopy = 60 - spliced.length
          }
        }
      }
      this.paginatedLogs = paginated
    },
    async updateLogs() {
      this.loading = true
      await this.getLog()
      this.paginateLog()
      this.loading = false
    },
    getIconColor(level) {
      return level == 'warn' ? 'amber' :
      level == 'error' ? 'orange darken-3' :
      level == 'crit' ? 'deep-orange' :
      (level == 'alert' || level == 'emerg') ? 'red' : null
    },
    getIconName(level) {
      return level == 'info' ? null :
      level == 'debug' ? 'mdi-bug' :
      level == 'notice' ? 'mdi-information' :
      level == 'warn' ? 'mdi-alert' : 'mdi-alert-circle'
    },
    checkDateArray() {
      if (this.date.length > 1 && new Date(this.date[0]).getTime() > new Date(this.date[1]).getTime()) {
        this.date.reverse()
      }
    }
  },
  computed: {
    localDate() {
      if (this.date) {
        if (this.date.length > 1) {
            return new Date(this.date[0]).toLocaleDateString({},
              {month: 'short', day: 'numeric', year: 'numeric'}) + ' ~ ' +
            new Date(this.date[1]).toLocaleDateString({},
              {month: 'short', day: 'numeric', year: 'numeric'})
        } else {
          return new Date(this.date).toLocaleDateString({}, {month: 'short', day: 'numeric', year: 'numeric'})
        }
      } else {
        return null
      }
    },
    hideDetailsCheck() {
      return this.$vuetify.breakpoint.mdAndDown ? 'auto' : false
    }
  }
}
</script>
