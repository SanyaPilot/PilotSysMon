<template>
  <div>
    <v-row>
      <v-col cols=12>
        <v-card
          :hover="!$vuetify.breakpoint.mobile"
          :outlined="$vuetify.breakpoint.mobile"
        >
          <v-card-title class=pb-2>{{ $t('disksinfo.header') }}</v-card-title>
          <v-card-text>
            <table class="mountpoints-table" v-if="this.$vuetify.breakpoint.mdAndUp">
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
            <table
              v-for="mountpoint in mountpoints.data" :key="mountpoint[0]"
              class="mountpoints-horiz-table"
              :style="mountpoint == mountpoints.data[0] ? '' : 'margin-top: 10px'"
              v-else
            >
              <colgroup>
                <col width="0px">
                <col>
              </colgroup>
              <tr v-for="i in 4" :key="i">
                <td><b>{{ mountpoints.header[i] }}</b></td>
                <td class="d-flex pl-3" v-if="mountpoints.header[i] == 'Usage'">
                  <v-progress-linear class="align-self-center" :value="usages[mountpoint[0]].percent"></v-progress-linear>
                  <span class="flex-shrink-0 ml-2">{{ usages[mountpoint[0]].used }} / {{ usages[mountpoint[0]].total }}</span>
                </td>
                <td class="pl-3" style="overflow-wrap: anywhere;" v-else>{{ mountpoint[i] }}</td>
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
export default {
  name: 'DisksInfo',

  data: function() {
    return {
        mountpoints: {
          data: [],
          header: [this.$t('disksinfo.device'), this.$t('disksinfo.mountpoint'),
          this.$t('disksinfo.type'), this.$t('disksinfo.options'), this.$t('disksinfo.usage')],
        },
        usages: {}
      }
  },
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
.mountpoints-horiz-table {
  width: 100%;
  border-style: none;
  border-spacing: 0px;
}
</style>
