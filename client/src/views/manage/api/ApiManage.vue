<template>
  <div class="manage-api">
    <div class="api-list">
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
          <template slot-scope="{row}">
            <div class="api-control">
              <el-button type="text" size="small" @click="setAuthority(row)">权限</el-button>
              <el-button type="text" size="small" @click="apiEdit(row)">编辑</el-button>
              <el-button type="text" size="small" @click="apiDoc(row)">文档</el-button>
              <el-button type="text" size="small" @click="apiDelete(row)">删除</el-button>
            </div>
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
import ApiAuthority from './ApiAuthority'
import { mapActions } from 'vuex'

export default {
  components: {
    ApiAuthority
  },
  data () {
    return {
      showAuthority: false,
      api: {},
      apis: []
    }
  },
  computed: {
    apiList () {
      return this.apis.map(api => ({
        ...api,
        groupName: this.getGroupName(api.group)
      }))
    },
    groups () {
      return this.$store.state.groups
    }
  },
  methods: {
    ...mapActions(['getManageApi']),
    getGroupName (groupId) {
      const group = this.groups.find(g => g._id === groupId)
      return group ? group.name : '无权查看的分组'
    },
    timeFormat (row, col) {
      return moment(new Date(Number(row[col.property]))).format('YYYY-MM-DD HH:mm:ss')
    },
    async getApis () {
      this.apis = (await this.getManageApi()).data
    },
    // 设置权限
    setAuthority (api) {
      this.api = api
      this.showAuthority = true
    },
    // 查看API文档
    apiDoc (api) {
      this.api = api
      this.$router.push({
        name: 'ApiDoc',
        params: {
          groupId: this.api.group,
          apiId: this.api._id
        }
      })
    },
    // API编辑
    apiEdit (api) {
      this.api = api
      this.$router.push({
        name: 'Edit',
        params: {
          groupId: this.api.group,
          apiId: this.api._id
        }
      })
    },
    // API删除
    apiDelete (api) {
      this.api = api
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 确认删除
    confirmDelete () {
      this.$store.dispatch('deleteApi', {
        api: this.api
      }).then(() => {
        this.$message.success('删除成功')
        this.getApis()
      }).catch(err => this.$message.error(err.msg))
    }
  },
  mounted () {
    this.getApis()
  }
}
</script>
