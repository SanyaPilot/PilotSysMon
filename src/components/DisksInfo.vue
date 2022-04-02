<template>
  <div>
    <panel-header>Storage devices info</panel-header>
    <v-row>
      <v-col cols=12>
        <v-card hover>
          <v-card-title>Mountpoints</v-card-title>
          <v-card-text>
            <table class="mountpoints-table">
              <colgroup>
                <col span="3">
                <col style="width: 50%;">
                <col style="width: 30%;">
              </colgroup>
              <tr>
                <th v-for="data in mountpoints.header" :key="data" :style="data == mountpoints.header[0] ? null : 'padding-left: 10px;'"><b>{{ data }}</b></th>
              </tr>
              <tr v-for="mountpoint in mountpoints.data" :key="mountpoint[0]">
                <td v-for="data in mountpoint" :key="data" :style="(data == mountpoint[0] ? '' : 'padding-left: 10px;') + (data == mountpoint[3] ? 'word-break: break-word;' : '')">{{ data }}</td>
                <td style="padding-left: 10px;">
                  <span style="float: right;">{{ usages[mountpoint[0]].used }} / {{ usages[mountpoint[0]].total }}</span>
                  <v-progress-linear :value="usages[mountpoint[0]].percent"></v-progress-linear>
                </td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import getDisksData from '../API/disks.js'
import PanelHeader from './import/PanelHeader.vue'
export default {
  name: 'DisksInfo',

  components: {
    PanelHeader
  },

  data: () => ({
      mountpoints: {
        header: ['Device', 'Mountpoint', 'Type', 'Options', 'Usage'],
        data: []
      },
      usages: {}
  }),
  async created() {
    await this.getMountpoints()
  },
  methods: {
    async getMountpoints() {
      const response = await getDisksData(true)
      this.rawdata = response
      response.forEach((item) => {
        this.mountpoints.data.push([item.device, item.mountpoint, item.fs, item.opts])
        this.usages[item.device] = item.usage
      });
    }
  }
}
</script>

<style>
.mountpoints-table {
  border-style: none;
  border-spacing: 0 8px;
  margin-top: -10px;
  width: 100%;
}
</style>
