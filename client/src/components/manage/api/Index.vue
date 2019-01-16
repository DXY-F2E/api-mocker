<template>
  <div class="manage-api">
    <div
      v-for="(item, i) in totalApiList"
      :key="i"
      class="api-list">
      <h1>{{ item.title }}</h1>
      <el-table :data="item.apis" style="width: 100%">
        <el-table-column prop="options.method" label="方法" width="70">
        </el-table-column>
        <el-table-column prop="name" label="接口名">
        </el-table-column>
        <el-table-column prop="groupName" label="所属分组">
        </el-table-column>
        <el-table-column prop="createTime" :formatter="timeFormat" width="200" label="创建时间">
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template scope="scope">
            <control :api="scope.row" @delete="apiDelete" @manage="manageApi"></control>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <api-authority :api="api" :visible="showAuthority" @hide="showAuthority = false">
    </api-authority>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import Control from './ApiControl'
import ApiAuthority from './ApiAuthority'

export default {
  components: {
    Control,
    ApiAuthority
  },
  data () {
    return {
      showAuthority: false,
      apis: [],
      manageGroups: [],
      api: {}
    }
  },
  computed: {
    totalApiList () {
      const myCreateApiList = [{
        title: '我创建的 API',
        apis: this.formatApiList(this.apis)
      }]
      const manageGroupApiList = this.manageGroups
      return [...myCreateApiList, ...manageGroupApiList].filter(item => item.apis.length)
    },
    groups () {
      return this.$store.state.groups
    }
  },
  methods: {
    ...mapActions([
      'getManageApi',
      'getApisByGroupManager',
      'getManageGroup'
    ]),
    getGroup (groupId) {
      const group = this.groups.find(g => g._id === groupId)
      return group ? group.name : '无权查看的分组'
    },
    formatApiList (apis) {
      return apis.map(api => ({
        ...api,
        groupName: this.getGroup(api.group)
      }))
    },
    manageApi (api) {
      this.api = api
      this.showAuthority = true
    },
    timeFormat (row, col) {
      return moment(new Date(Number(row[col.property]))).format('YYYY-MM-DD HH:mm:ss')
    },
    async getApis () {
      // 获取我创建的 api
      this.apis = (await this.getManageApi()).data

      // 获取我管理的组下的 api
      const groups = (await this.getManageGroup()).data
      const manageGroups = []
      for (let group of groups) {
        const { _id: groupId, name: groupName } = group
        const apis = (await this.getApisByGroupManager(groupId)).data
        manageGroups.push({
          title: groupName,
          apis: this.formatApiList(apis)
        })
      }
      this.manageGroups = manageGroups
    },
    apiDelete (api) {
      this.getApis()
    }
  },
  mounted () {
    this.getApis()
  }
}
</script>
<style lang="less" scoped>
.api-list {
  h1 {
    margin: 20px 0;
  }
}
</style>
