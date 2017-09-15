<template>
  <div class="manage-api">
    <el-table :data="richApis" style="width: 100%">
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
      api: {}
    }
  },
  computed: {
    richApis () {
      return this.apis.map(a => {
        a.groupName = this.getGroup(a.group)
        return a
      })
    },
    groups () {
      return this.$store.state.groups
    }
  },
  methods: {
    ...mapActions([
      'getManageApi'
    ]),
    getGroup (groupId) {
      const group = this.groups.find(g => g._id === groupId)
      return group ? group.name : '无权查看的分组'
    },
    manageApi (api) {
      this.api = api
      this.showAuthority = true
    },
    timeFormat (row, col) {
      return moment(new Date(Number(row[col.property]))).format('YYYY-MM-DD HH:mm:ss')
    },
    getApis () {
      this.getManageApi().then(rs => {
        this.apis = rs.data
      })
    },
    apiDelete (api) {
      const index = this.apis.findIndex(a => a === api)
      this.apis.splice(index, 1)
    }
  },
  mounted () {
    this.getApis()
  }
}
</script>
<style>
</style>
