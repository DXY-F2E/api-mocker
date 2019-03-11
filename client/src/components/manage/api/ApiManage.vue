<template>
  <div class="manage-api">
    <div class="api-list">
      <h1>{{ title }}</h1>
      <el-table :data="apiList" style="width: 100%">
        <el-table-column prop="options.method" label="方法" width="80">
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
import moment from 'moment'
import Control from './ApiControl'
import ApiAuthority from './ApiAuthority'

export default {
  components: {
    Control,
    ApiAuthority
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    apis: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showAuthority: false,
      api: {}
    }
  },
  computed: {
    apiList () {
      return this.formatApiList(this.apis)
    },
    groups () {
      return this.$store.state.groups
    }
  },
  methods: {
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
    apiDelete (api) {
      this.$emit('refresh')
    }
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
