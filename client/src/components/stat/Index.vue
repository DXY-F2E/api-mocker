<template>
<div class="content" id="statistics">
  <chart-mock></chart-mock>
</div>
</template>

<script>
import ChartMock from './Mock'
export default {
  components: {
    ChartMock
  }
}
</script>
<style lang="less">
#statistics {
  padding: 40px;

  .chart {
    .header {
      text-align: center;
      position: relative;

      .control {
        position: absolute;
        right: 50px;
        top: 0;
      }
    }
    h4 {
      font-size: 24px;
      height: 36px;
      line-height: 36px;
    }
  }
}
</style>
