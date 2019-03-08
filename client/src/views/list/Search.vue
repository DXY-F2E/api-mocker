<template>
  <div>
    <div class="search-wrap">
      <div class="search-title">统一搜索<small>（分组、接口）</small></div>
      <el-input @keyup.native.enter="handleSearch" placeholder="可搜索名称、接口路径、管理员" v-model="keyword" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>
    <div class="result-title">分组</div>
    <template>
      <div v-if="groupList.resources.length">
        <group-list :data="groupList.resources"></group-list>
        <div class="result-pagenav">
          <el-pagination layout="prev, pager, next" :total="50"></el-pagination>
        </div>
      </div>
      <div class="empty-tip" v-else>未找到满足条件的分组</div>
    </template>
    <div class="result-title">接口</div>
    <template>
      <div v-if="apiList.resources.length">
        <api-list :data="apiList.resources"></api-list>
        <div class="result-pagenav">
          <el-pagination layout="prev, pager, next" :total="50"></el-pagination>
        </div>
      </div>
      <div class="empty-tip" v-else>未找到满足条件的接口</div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ApiList from './components/ApiList'
import GroupList from './components/GroupList'

export default {
  components: {
    ApiList,
    GroupList
  },
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    ...mapActions(['searchGroup', 'searchApi']),
    async handleSearch () {
      await this.searchGroup({ q: this.keyword })
      await this.searchApi({ q: this.keyword })
    }
  },
  computed: {
    ...mapState(['search']),
    groupList () {
      return this.search.groupList
    },
    apiList () {
      return this.search.apiList
    }
  },
  watch: {
    'search.keyword': (val, old) => {
      this.keyword = val
    }
  },
  mounted () {
    this.keyword = this.search.keyword
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
