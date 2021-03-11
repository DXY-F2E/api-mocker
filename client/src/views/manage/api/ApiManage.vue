<template>
  <div class="manage-api">
    <div class="api-list">
      <slot name="search"></slot>
      <el-table :data="apiList" style="width: 100%">
        <el-table-column prop="name" label="接口名"></el-table-column>
        <el-table-column prop="options.method" label="方法" width="80"></el-table-column>
        <el-table-column prop="prodUrl" label="线上地址"></el-table-column>
        <el-table-column prop="devUrl" label="测试地址"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="{row}">
            {{ row.status | status }}
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="所属分组">
          <template slot-scope="scope">
             {{getParent(scope.row)}}
           </template>
        </el-table-column>
        <el-table-column prop="createTime" :formatter="timeFormat" width="200" label="创建时间"></el-table-column>
        <el-table-column width="240" label="操作">
          <template slot-scope="{row}">
            <div class="api-control">
              <el-button type="text" size="small" @click="setAuthority(row)">权限</el-button>
              <el-button type="text" size="small" @click="apiEdit(row)">编辑</el-button>
              <el-button type="text" size="small" @click="apiStatusEdit(row)">更新状态</el-button>
              <el-button type="text" size="small" @click="apiDoc(row)">文档</el-button>
              <el-button type="text" size="small" @click="apiDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <api-authority :api="api" :visible="showAuthority" @hide="showAuthority = false"></api-authority>
    <api-status :api="api" :visible="showStatus" @hide="hideStatusDialog"></api-status>
  </div>
</template>

<script>
import moment from 'moment'
import ApiAuthority from './ApiAuthority'
import ApiStatus from './ApiStatus'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'

export default {
  components: {
    ApiAuthority,
    ApiStatus,
    Pagination,
    SearchInput
  },
  props: {
    apis: {
      type: Array,
      default: () => []
    },
    count: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      showAuthority: false,
      showStatus: false,
      api: {}
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
    getParent ({ parent: parents, group }) {
      if (parents.length === 0) return this.getGroupName(group)
      return parents.map(g => g.name).join(' / ') + ' / ' + this.getGroupName(group)
    },
    getGroupName (groupId) {
      const group = this.groups.find(g => g._id === groupId)
      return group ? group.name : '无权查看的分组'
    },
    timeFormat (row, col) {
      return moment(new Date(Number(row[col.property]))).format(
        'YYYY-MM-DD HH:mm:ss'
      )
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
    // API 状态 编辑
    apiStatusEdit (api) {
      this.api = api
      this.showStatus = true
    },
    // API删除
    apiDelete (api) {
      this.api = api
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.confirmDelete()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 确认删除
    confirmDelete () {
      this.$store
        .dispatch('deleteApi', {
          api: this.api
        })
        .then(() => {
          this.$message.success('删除成功')
          this.$emit('reload')
        })
        .catch(err => this.$message.error(err.msg))
    },
    hideStatusDialog (info) {
      this.showStatus = false
      if (info && info.reload) {
        this.$emit('reload')
      }
    }
  }
}
</script>
