<template>
<div class="chart-line">
折线图
</div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  props: {
    title: String,
    data: {
      type: Object,
      require: true
    }
  },
  watch: {
    data: {
      handler () {
        this.renderChart()
      },
      deep: true
    }
  },
  methods: {
    renderChart () {
      // 绘制图表
      this.chart.setOption({
        color: ['#20a0ff', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        title: {
          text: this.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          data: this.data.x
        },
        yAxis: {},
        series: [{
          name: 'value',
          type: 'line',
          showSymbol: false,
          data: this.data.y
        }]
      })
    }
  },
  mounted () {
    this.chart = echarts.init(this.$el)
    this.renderChart()
  }
}
</script>
<style>
.chart-line {
  min-width: 300px;
  min-height: 400px;
}
</style>
