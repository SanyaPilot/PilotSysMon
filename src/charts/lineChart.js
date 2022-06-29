import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    window.Chart.defaults.global.defaultFontColor = this.$vuetify.theme.isDark ? '#fff' : '#666';
    this.renderChart(this.chartData, this.options)
  }
}
