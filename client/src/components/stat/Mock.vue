<template>
<div class="chart mock-chart">
  <div class="header">
    <h4>Mock请求量</h4>
    <el-button-group class="control" :class="interval">
      <el-button class="week" @click="getData('week')">周</el-button>
      <el-button class="mouth" @click="getData('mouth')">月</el-button>
      <el-button class="quarter" @click="getData('quarter')">季</el-button>
    </el-button-group>
  </div>
  <chart-line v-if="mockData.x.length"
        :data="mockData"></chart-line>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import ChartLine from '../common/charts/Line'
import moment from 'moment'
export default {
  components: {
    ChartLine
  },
  data () {
    return {
      interval: 'week',
      mockData: {
        x: [],
        y: []
      },
      query: {
        start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    ...mapActions(['getMockStat']),
    getData (interval) {
      this.interval = interval
      let days = 7
      if (interval === 'quarter') {
        days = 90
      } else if (interval === 'mouth') {
        days = 30
      }
      this.query.start = moment().subtract(days, 'days').format('YYYY-MM-DD')
      this.getMock()
    },
    buildStat (data) {
      const fullData = []
      const mapData = {}
      data.forEach(d => {
        mapData[d._id] = d
      })
      let start = this.query.start
      while (start <= this.query.end) {
        fullData.push(mapData[start] || {
          _id: start,
          count: 0
        })
        start = moment(start).add(1, 'days').format('YYYY-MM-DD')
      }
      return fullData
    },
    getMock () {
      this.getMockStat(this.query).then(rs => {
        this.mockData = {
          x: [],
          y: []
        }
        this.buildStat(rs.data).forEach(r => {
          this.mockData.x.push(r._id)
          this.mockData.y.push(r.count)
        })
      })
    }
  },
  mounted () {
    this.getMock()
  }
}
</script>
<style scoped>
.week .week,
.mouth .mouth,
.quarter .quarter {
  color: #20a0ff;
  border-color: #20a0ff;
  z-index: 1;
}
</style>
