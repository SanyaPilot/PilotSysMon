<template>
  <v-card hover>
    <v-card-title class="justify-space-between">
      CPU details
    </v-card-title>
    <v-card-text>
      <table class="data-table">
        <tr v-for="item in data" :key="item.name">
          <td class="table-value-name"><b>{{item.name}}</b></td>
          <td class="table-value">{{item.value}}</td>
        </tr>
      </table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "cpu-details",
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>
