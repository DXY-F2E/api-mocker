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
    <el-row class="group-actions" type="flex" justify="space-between">
      <el-col :span="12">
        <el-button type="primary" @click="createApi">创建接口</el-button>
        <el-button @click="handleFavorite">{{ isFavorite ? '已收藏' : '收藏' }}</el-button>
        <el-button>订阅</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button><import-rap-json :group="group"></import-rap-json></el-button>
        <el-button><import-swagger-json :group="group"></import-swagger-json></el-button>
      </el-col>
    </el-row>
    <div class="api-list">
      <api-list :data="apiList" @sort="onSort"></api-list>
    </div>
    <div class="pagination" v-if="apiList.length">
      <page-nav :query="query" :total="count" @change="onPageNav"></page-nav>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Search from '@/components/common/SearchInput'
import ImportRapJson from '@/components/common/importJson/FromRap'
import ImportSwaggerJson from '@/components/common/importJson/FromSwagger'
import ApiList from './components/ApiList'
import PageNav from './components/PageNav'

export default {
  components: {
    Search,
    PageNav,
    ApiList,
    ImportRapJson,
    ImportSwaggerJson
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
    ...mapActions([
      'addFavorite',
      'removeFavorite'
    ]),
    handleFavorite () {
      if (this.isFavorite) {
        this.removeFavorite(this.groupId)
      } else {
        this.addFavorite(this.groupId)
      }
    },
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
    onSort (sortStr) {
      this.query.order = sortStr
      if (this.apiListLoading) {
        return
      }
      this.getData()
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
    },
    createApi () {
      const query = this.groupId ? `?groupId=${this.groupId}` : ''
      this.$router.push(`/create${query}`)
    }
  },
  computed: {
    ...mapState(['apiList', 'apiListLoading', 'groups', 'user']),
    groupId () {
      return this.$route.params.groupId
    },
    // 当前组
    group () {
      return this.groups.find(g => g._id === this.groupId) || {}
    },
    isFavorite () {
      return this.user.favorites.includes(this.groupId) || false
    }
  }
}
</script>

<style lang="less" scoped>
.group-title {
  font-size: 20px;
  color: #606266;
}

.group-actions {
  margin-top: 10px;
}

.api-list {
  margin-top: 20px;
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
