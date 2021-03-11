<template>
  <div>
    <div class="search-wrap">
      <div class="search-title">统一搜索<small>（分组、接口）</small></div>
      <el-popover placement="bottom-start" trigger="click" v-model="visible">
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
        <el-input slot="reference" @keyup.native.enter="searchActions" placeholder="支持分词搜索, 根据空格进行分词 (可搜索名称、接口路径、管理员)"
                  v-model="keyword" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchActions"></el-button>
        </el-input>
      </el-popover>
    </div>
    <div v-if="searched && keyword">
      <div class="result-title">分组</div>
      <template>
        <div v-if="groupList.resources.length">
          <group-list :data="groupList.resources"></group-list>
          <div class="result-pagenav">
            <page-nav @change="searchGroup" :query="groupList.pages" :total="groupList.pages.count"></page-nav>
          </div>
        </div>
        <div class="empty-tip" v-else>未找到满足条件的分组</div>
      </template>
      <div class="result-title">接口</div>
      <template>
        <div v-if="apiList.resources.length">
          <api-list :data="apiList.resources" :actions="['doc', 'edit']"></api-list>
          <div class="result-pagenav">
            <page-nav @change="searchApi" :query="groupList.pages" :total="groupList.pages.count"></page-nav>
          </div>
        </div>
        <div class="empty-tip" v-else>未找到满足条件的接口</div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ApiList from './components/ApiList'
import GroupList from './components/GroupList'
import PageNav from './components/PageNav'
import { debounce } from '@/util'
export default {
  components: {
    ApiList,
    GroupList,
    PageNav
  },
  data () {
    return {
      visible: false,
      searched: false,
      searchActions: debounce(this.handleSearch, 300)
    }
  },
  methods: {
    ...mapActions(['searchGroup', 'searchApi']),
    ...mapMutations(['SEARCH_KEYWORD', 'SEARCH_HISTORY_LIST_ADD', 'SEARCH_HISTORY_LIST_DELETE', 'SET_SEARCH_HISTORY_LIST']),
    async handleSearch () {
      if (this.keyword) {
        if (this.searchHistoryList.indexOf(this.keyword) < 0) {
          this.SEARCH_HISTORY_LIST_ADD(this.keyword)
          window.localStorage.setItem('historySearchList', JSON.stringify(this.searchHistoryList))
        }
      }
      this.searched = true
      await this.searchGroup({ q: this.keyword })
      await this.searchApi({ q: this.keyword })
    },
    searchHistory (keyword, index) {
      if (this.keyword !== keyword) {
        this.keyword = keyword
        this.SEARCH_HISTORY_LIST_DELETE(index)
      }
      this.visible = false
    },
    deleteHistoryItem (index) {
      this.SEARCH_HISTORY_LIST_DELETE(index)
      window.localStorage.setItem('historySearchList', JSON.stringify(this.searchHistoryList))
    }
  },
  computed: {
    ...mapState(['search']),
    groupList () {
      return this.search.groupList
    },
    apiList () {
      return this.search.apiList
    },
    searchHistoryList () {
      return this.search.searchHistoryList
    },
    keyword: {
      get () {
        return this.search.keyword
      },
      set (val) {
        this.SEARCH_KEYWORD({q: val})
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.SEARCH_KEYWORD({q: ''})
    next()
  },
  watch: {
    'keyword': {
      handler: function (val) {
        if (val) {
          this.searchActions()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.search-wrap {
  padding: 50px;
  background-color: rgb(233, 233, 235);
  border-radius: 8px 8px 0 0;
  .search-title {
    font-size: 22px;
    color: #606266;
    margin-bottom: 20px;
    small {
      font-size: 18px;
    }
  }
}

.result-block {
  max-height: 432px;
  overflow-y: auto;
  width: 600px;
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
}

.result-title {
  margin: 20px 0;
  font-size: 16px;
  color: #606266;
}
.result-pagenav {
  text-align: right;
  margin: 10px 0;
}
.empty-tip {
  color: #909399;
}
</style>
