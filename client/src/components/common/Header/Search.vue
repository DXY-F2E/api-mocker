<template>
  <div>
    <el-popover
      placement="top"
      trigger="manual"
      :width="300"
      v-model="visible">
      <div class="result-wrap">
        <div class="direct" v-if="!inSearchPage">
          <div class="result-tip">仅显示搜索结果前10条</div>
          <div class="result-block">
            <div class="block-title">分组</div>
            <ul class="block-list">
              <li class="list-item" v-for="item in groupList.resources" :key="item._id" @click="goApiList(item)">
                {{item.name}}
              </li>
            </ul>
          </div>
          <div class="result-block">
            <div class="block-title">接口</div>
            <ul class="block-list">
              <li class="list-item" v-for="item in apiList.resources" :key="item._id" @click="goApiDoc(item)">
                {{item.name}}
              </li>
            </ul>
          </div>
          <div class="result-more">
            <el-button type="text" @click="goMoreSearch">显示更多</el-button>
          </div>
        </div>
        <div v-else class="result-tip">在当前页面查看搜索结果</div>
      </div>
      <el-input slot="reference"
        @keyup.native.enter="searchActions"
        placeholder="统一搜索（分组、接口）"
        v-model="keyword">
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
      rootDomain: window.location.href.split('#')[0]
    }
  },
  watch: {
    'keyword': 'searchActions',
    '$route.name': function () {
      this.visible = false
      this.keyword = ''
    }
  },
  methods: {
    ...mapActions(['searchGroup', 'searchApi']),
    ...mapMutations(['SEARCH_KEYWORD']),
    goApiList (group) {
      const url = `${this.rootDomain}#/doc/${group._id}`
      window.open(url, '_blank')
    },
    goApiDoc (api) {
      const url = `${this.rootDomain}#/doc/${api.group}/${api._id}`
      window.open(url, '_blank')
    },
    async handleSearch () {
      this.visible = !!this.keyword
      if (this.keyword) {
        // 如果当前在搜索页，直接用大页面搜索
        if (this.inSearchPage) {
          this.SEARCH_KEYWORD({q: this.keyword})
          return
        }
        await this.searchGroup({ q: this.keyword, limit: 10 })
        await this.searchApi({ q: this.keyword, limit: 10 })
      }
    },
    goMoreSearch () {
      this.visible = false
      this.$router.push({ name: 'GlobalSearch' })
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
    inSearchPage () {
      return this.$route.name === 'GlobalSearch'
    }
  }
}
</script>

<style lang="less" scoped>
.result-more {
  text-align: center;
}
.list-item {
  padding: 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    background-color: #f5f7fa;
  }
}
.result-tip {
  text-align: center;
  color: #909399;
}
</style>
