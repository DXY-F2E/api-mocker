<template>
  <div>
    <el-popover placement="top" trigger="click" v-model="visible">
      <div class="result-wrap">
        <div class="direct">
          <div class="main-content">
            <div class="result-block">
              <div class="block-title">历史搜索列表(最多20个)</div>
              <ul class="block-list">
                <li
                  class="list-item"
                  v-for="(keyword, index) in searchHistoryList"
                  :key="index"
                  @click="searchHistory(keyword, index)"
                >{{ keyword }}<i class="el-icon-delete delete-icon" @click.stop="deleteHistoryItem(index)" /></li>
              </ul>
            </div>
            <div>
              <div class="result-wrapper">
                <div class="result-block">
                  <div class="block-title">搜索分组结果</div>
                  <ul class="block-list">
                    <li
                      class="list-item"
                      v-for="item in groupList.resources"
                      :key="item._id"
                      @click="goApiList(item)"
                    >{{getGroupName(item)}}</li>
                  </ul>
                </div>
                <div class="result-block">
                  <div class="block-title">搜索接口结果</div>
                  <ul class="block-list">
                    <li
                      class="list-item"
                      v-for="item in apiList.resources"
                      :key="item._id"
                      @click="goApiDoc(item)"
                    >{{item.name}}</li>
                  </ul>
                </div>
              </div>
              <div class="result-more" v-if="groupList.resources.length || apiList.resources.length">
                <el-button type="text" @click="goMoreSearch">显示更多</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-input
        slot="reference"
        @keyup.native.enter="searchActions"
        placeholder="统一搜索（分组、接口）"
        v-model="keyword"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { debounce } from '@/util'

export default {
  data () {
    return {
      keyword: '',
      visible: false,
      searchActions: debounce(this.handleSearch, 300),
      rootDomain: window.location.href.split('#')[0],
      autoRedirect: false,
      autoRedirectApi: () => {
        const apiList = this.apiList
        // 初次搜索，autoRedirect 为 true，且接口结果只为 1 条时，自动跳转
        if (this.autoRedirect && apiList && apiList.resources && apiList.resources.length && apiList.resources.length === 1) {
          this.resetAutoRedirect()
          this.goApiDoc(apiList.resources[0], true)
        } else {
          this.resetAutoRedirect()
        }
      }
    }
  },
  watch: {
    'keyword': 'searchActions',
    '$route.name': function () {
      this.visible = false
      this.keyword = ''
    },
    apiList: 'autoRedirectApi'
  },
  methods: {
    ...mapActions(['searchGroup', 'searchApi']),
    ...mapMutations(['SEARCH_KEYWORD', 'SEARCH_HISTORY_LIST_ADD', 'SEARCH_HISTORY_LIST_DELETE', 'SET_SEARCH_HISTORY_LIST']),
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
    goApiList (group) {
      const url = `${this.rootDomain}#/doc/${group._id}`
      window.open(url, '_blank')
    },
    goApiDoc (api, noBlank) {
      const url = `${this.rootDomain}#/doc/${api.group}/${api._id}`
      window.open(url, noBlank ? '_self' : '_blank')
    },
    searchHistory (keyword, index) {
      if (this.keyword !== keyword) {
        this.keyword = keyword
        this.SEARCH_HISTORY_LIST_DELETE(index)
      }
      this.visible = !this.inSearchPage
    },
    deleteHistoryItem (index) {
      this.SEARCH_HISTORY_LIST_DELETE(index)
      window.localStorage.setItem('historySearchList', JSON.stringify(this.searchHistoryList))
    },
    async handleSearch () {
      if (this.keyword) {
        if (this.searchHistoryList.indexOf(this.keyword) < 0) {
          this.SEARCH_HISTORY_LIST_ADD(this.keyword)
          window.localStorage.setItem('historySearchList', JSON.stringify(this.searchHistoryList))
        }
        // 如果当前在搜索页，直接用大页面搜索
        if (this.inSearchPage) {
          this.SEARCH_KEYWORD({q: this.keyword})
          this.visible = false
          return
        }
        await this.searchGroup({ q: this.keyword, limit: 10 })
        await this.searchApi({ q: this.keyword, limit: 10 })
      }
    },
    goMoreSearch () {
      this.visible = false
      this.$router.push({ name: 'GlobalSearch' })
    },
    resetAutoRedirect () {
      const query = this.$route.query
      this.$router.push({
        query: {
          ...query,
          autoRedirect: false
        }
      })
      this.autoRedirect = false
    }
  },
  computed: {
    ...mapState(['search', 'groups']),
    groupList () {
      return this.search.groupList
    },
    apiList () {
      return this.search.apiList
    },
    searchHistoryList () {
      return this.search.searchHistoryList
    },
    inSearchPage () {
      return this.$route.name === 'GlobalSearch'
    }
  },
  async mounted () {
    let historySearchListStr = window.localStorage.getItem('historySearchList') || '[]'
    let historySearchList = JSON.parse(historySearchListStr)
    this.SET_SEARCH_HISTORY_LIST(historySearchList)
    let { autoRedirect, keyword } = this.$route.query
    this.autoRedirect = autoRedirect === 'true'
    if (this.autoRedirect) {
      this.keyword = keyword
      await this.handleSearch()
    }
  }
}
</script>

<style lang="less" scoped>
.list-item {
  padding: 10px 20px 10px 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    background-color: #f5f7fa;
  }
  .delete-icon {
    float: right;
  }
}
.result-tip {
  color: #909399;
}
.result-wrap {
  .main-content {
    display: flex;
    flex-direction: row;
    .result-block {
      max-height: 432px;
      overflow-y: auto;
      width: 280px;
      margin: 0 10px;
    }
    .result-wrapper {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
