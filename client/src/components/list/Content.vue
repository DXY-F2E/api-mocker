<template>
  <div>
    <el-row type="flex" justify="space-between" v-if="group" class="group-title">
      <el-col :span="8">
        {{ `${group.name} 接口列表` }}&nbsp;&nbsp;
        <el-button type="text" @click="goGroupDoc">进入文档模式</el-button>
      </el-col>
      <el-col :span="8">
        <search size="small"
                @query="onQuery"
                :placeholder="`在 ${group.name} 中查找接口`"></search>
      </el-col>
    </el-row>
    <div class="api-list">
      <api-list></api-list>
    </div>
    <page-nav :query="query" :total="count" :on-page-nav="onPageNav"></page-nav>
  </div>
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
    },
    // 进入分组文档
    goGroupDoc () {
      this.$router.push({
        name: 'GroupDoc',
        params: {
          groupId: this.group._id
        }
      })
    }
  },
  computed: {
    ...mapState(['apiList', 'apiListLoading', 'groups']),
    // 当前组
    group () {
      return this.groups.find(g => g._id === this.$route.params.groupId)
    }
  }
}
</script>

<style lang="less" scoped>
.group-title {
  font-size: 20px;
  color: #606266;
}

.api-list {
  margin-top: 20px;
}
</style>
