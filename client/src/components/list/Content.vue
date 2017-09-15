<template>
  <el-col :span="24">
    <div class="content-wrap">
      <div id="content">
        <search @query="onQuery" placeholder="回车搜索：api名称、线上地址、测试地址、接口ID、管理员"></search>
        <api-list></api-list>
        <page-nav :query="query" :total="count" :on-page-nav="onPageNav"></page-nav>
      </div>
    </div>
  </el-col>
</template>
<script>
import Search from './Search'
import ApiList from './ApiList'
import PageNav from './PageNav'
import { mapState } from 'vuex'
export default {
  components: {
    Search,
    PageNav,
    ApiList
  },
  data () {
    return {
      query: this.initQuery(),
      count: 0
    }
  },
  mounted () {
    Promise.all([this.getData(true)])
  },
  watch: {
    $route (to) {
      if (to.matched[1].name === 'List') {
        this.initQuery()
        this.getData()
      }
    }
  },
  methods: {
    initQuery () {
      this.query = {
        q: '',
        limit: 16,
        page: 1
      }
      return this.query
    },
    getData () {
      this.$store.dispatch('getApiList', {
        groupId: this.$route.params.groupId,
        query: this.query
      }).then(res => {
        if (!res || !res.data) {
          return
        }
        const pages = res.data.pages
        this.query.page = pages.page
        this.count = pages.count
      }).catch(err => this.$message.error(`加载数据失败:${err.msg}`))
    },
    onPageNav (currentPage) {
      this.query.page = currentPage
      if (this.apiListLoading) {
        return
      }
      this.getData()
    },
    onQuery (filter) {
      this.query.q = filter
      this.query.page = 1
      if (this.inputShakeTime || this.apiListLoading) {
        return
      }
      this.inputShakeTime = setTimeout(() => {
        this.getData()
        this.inputShakeTime = null
      }, 500)
    }
  },
  computed: mapState(['apiList', 'apiListLoading'])
}
</script>
<style>
.content-wrap {
  padding: 20px;
  background-color: #F9FAFC;
  min-height: 100%;
  position: relative;
}
.api-list-box {
  position: absolute;
  top: 65px;
  bottom: 90px;
  overflow-y: auto;
  left: 10px;
  right: 10px;
}
</style>
