<template>
  <div>
    <el-row type="flex" justify="space-between" v-if="group._id" class="group-title">
      <el-col :span="8">
        {{ `${getGroupName(group) || ''} 接口列表` }}&nbsp;&nbsp;
        <el-button type="text" @click="goGroupDoc">进入文档模式</el-button>
      </el-col>
      <el-col :span="8">
        <search size="small"
                @query="onQuery"
                :placeholder="group.name ? `在 ${group.name } 中查找接口` : '查找接口'"></search>
      </el-col>
    </el-row>
    当前api组管理员：{{groupDetail.managerName}}
    <div class="tip-container">
      <h3>小贴士</h3>
      <div class="detail">
        <div>当前接口分组hash为<strong>{{group._id}}</strong>，则组内接口mock地址前缀均为 <strong>{{urlJoin(this.serverRoot, '/client', group._id)}}</strong>，可作为组内接口通用的baseUrl（未配置接口路径的api无法使用该前缀）</div>
        <div>如当api配置了接口路径为/api/login时，则mock地址为{{urlJoin(this.serverRoot, 'client',  group._id, 'api/login')}}</div>
      </div>
    </div>
    
    <el-row class="group-actions" type="flex" justify="space-between">
      <el-col :span="12">
        <el-button type="primary" @click="createApi">创建接口</el-button>
        <el-button @click="handleFavorite">{{ isFavorite ? '已收藏' : '收藏' }}</el-button>
        <el-button>订阅</el-button>
        <el-button @click="exportSingleGroup">导出分组</el-button>
        <el-button @click="batchExport">批量导出</el-button>
      </el-col>
      <el-col :span="12" class="import-area">
        <div class="import-button"><import-json :group="group" @refresh="refresh" /></div>
      </el-col>
    </el-row>
    <div class="api-list">
      <api-list :data="apiList" @sort="onSort" @selectApis="selectApis"></api-list>
    </div>
    <div class="pagination" v-if="apiList.length">
      <page-nav :query="query" :total="count" @change="onPageNav"></page-nav>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Search from '@/components/common/SearchInput'
import ImportJson from '@/components/common/importJson/Index'
import ApiList from './components/ApiList'
import PageNav from './components/PageNav'
import { urlJoin } from '@/util'
import download from '@/util/download'

export default {
  components: {
    Search,
    PageNav,
    ApiList,
    ImportJson
  },
  data () {
    return {
      query: this.initQuery(),
      count: 0,
      selectedApiList: []
    }
  },
  mounted () {
    Promise.all([this.getData(true)])
  },
  watch: {
    'groupId': {
      handler: function (val) {
        if (val) {
          this.getGroup(val)
        }
      },
      immediate: true
    },
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
      'removeFavorite',
      'exportGroup',
      'exportApi',
      'getGroup'
    ]),
    getGroupName (group) {
      group.parents = this.getParent(group, this.groups)
      const { parents, name } = group
      if (!parents || parents.length === 0) return name
      return parents.map(g => g.name).join(' / ') + ' / ' + name
    },
    getParent (g, groups) {
      let res = []
      if (g.pGroup) {
        const parent = groups.find(group => group._id === g.pGroup)
        if (parent) res.push(parent)
        if (parent && parent.pGroup) res = [...this.getParent(parent, groups), ...res]
      }
      return res
    },
    urlJoin (...args) {
      return urlJoin(...args)
    },
    refresh () {
      this.initQuery()
      this.getData()
    },
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
    },
    selectApis (apis) {
      this.selectedApiList = apis
    },
    async exportSingleGroup () {
      let res = await this.exportGroup(this.groupId)
      download(res, this.group.name)
    },
    async batchExport () {
      let {selectedApiList} = this
      if (selectedApiList.length) {
        let res = await this.exportApi(selectedApiList)
        download(res, this.group.name)
      } else {
        this.$message.error('请至少选择一个接口')
      }
    }
  },
  computed: {
    ...mapState(['apiList', 'apiListLoading', 'groups', 'user', 'serverRoot', 'curGroup', 'groupDetail']),
    groupId () {
      return this.$route.params.groupId
    },
    // 当前组
    group () {
      return this.curGroup || this.groups.find(g => g._id === this.groupId) || {}
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
.tip-container {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
  margin: 20px 0 30px;
  .detail {
    margin-left: 10px;
    color: #5e6d82;
    div:first-child {
      margin: 10px 0;
    }
  }
}
.group-actions {
  margin-top: 10px;
}
.import-area {
  display: flex;
  justify-content: flex-end;
  .import-button {
    margin-left: 20px;
  }
}
.api-list {
  margin-top: 20px;
}
</style>
