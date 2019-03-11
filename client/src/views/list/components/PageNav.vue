<template>
  <div class="page-nav">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="query.page"
      :page-size="query.limit"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    query: {
      type: Object,
      default () {
        return {
          page: 1,
          limit: 16
        }
      }
    }
  },
  methods: {
    handleCurrentChange (currentPage) {
      if (currentPage === this.query.page) {
        return
      }
      this.$emit('change', currentPage)
    }
  }
}
</script>
