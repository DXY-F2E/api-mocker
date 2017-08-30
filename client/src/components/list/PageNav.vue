<template>
    <div class="page-nav" v-show="showNav">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="query.page"
          :page-size="query.limit"
          layout="prev, pager, next, jumper"
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
    },
    onPageNav: {
      type: Function,
      required: true
    }
  },
  computed: {
    showNav () {
      return this.total > this.query.limit
    }
  },
  methods: {
    handleCurrentChange (currentPage) {
      if (currentPage === this.query.page) {
        return
      }
      this.onPageNav(currentPage)
    }
  }
}
</script>
<style>
.page-nav {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    text-align: center;
}
</style>
