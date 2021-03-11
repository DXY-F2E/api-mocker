<template>
  <div class="manage-group">
    <div class="mode-switch" :class="mode">
      <el-row>
        <el-col :span="20">
          <el-button size="small" class="managed" @click.native="getMyGroups">我的分组</el-button>
          <el-button size="small" class="unmanaged" @click.native="getUnmanaged">未认领分组</el-button>
        </el-col>
        <el-col :span="4">
          <SearchInput :size="'small'" :placeholder="'搜索分组'" @query="queryGroups"/>
        </el-col>
      </el-row>
    </div>
    <div class="group-table">
      <el-table :data="groups" style="width: 100%">
        <el-table-column prop="name" label="分组名"></el-table-column>
        <el-table-column prop="level" label="所属分组层级">
           <template slot-scope="scope">
             {{getParent(scope.row.parent)}}
           </template>
        </el-table-column>
        <el-table-column prop="createTime" :formatter="timeFormat" width="200" label="创建时间"></el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <control
              :group="scope.row"
              :mode="mode"
              @delete="groupDelete"
              @manage="manageGroup"
              @api-manage="manageGroupApi"
            ></control>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <Pagination :total="count" :query="queryGroup" @change="changeForGroups"/>
    </div>
    <template v-if="manageApi.title">
      <div class="searchWrapper">
        <SearchInput class="api-search" @query="queryApis" :size="'small'" :placeholder="'搜索接口'"/>
      </div>
    </template>
    <template v-if="manageApi.title">
      <api-manage class="api-manage" :apis="manageApi.apis" :count="apiCount" @reload="getApis"/>
      <div class="pagination">
        <Pagination :total="apiCount" :query="queryApi" @change="changeForApis"/>
      </div>
    </template>
    <group-edit
      v-if="group"
      :visible="showGroupEdit"
      :group="group"
      @update="updateGroup"
      @hide="showGroupEdit = false"
    ></group-edit>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import Control from './GroupControl'
import GroupEdit from './GroupEdit'
import ApiManage from '../api/ApiManage'
import R from 'ramda'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'

export default {
  components: {
    Control,
    GroupEdit,
    ApiManage,
    Pagination,
    SearchInput
  },
  data () {
    return {
      showGroupEdit: false,
      mode: 'managed',
      group: null,
      groups: [],
      manageApi: {
        title: '',
        apis: []
      },
      queryGroup: {
        q: '',
        page: 1,
        limit: 3
      },
      queryApi: {
        groupId: '',
        q: '',
        page: 1,
        limit: 16
      },
      count: 0,
      apiCount: 0
    }
  },
  methods: {
    ...mapActions([
      'getManageGroup',
      'getUnmanagedGroup',
      'getApisByGroupManager'
    ]),
    timeFormat (row, col) {
      return moment(new Date(Number(row[col.property]))).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    },
    getParent (parents) {
      if (parents.length === 0) return ''
      return parents.map(g => g.name).join(' / ')
    },
    getUnmanaged () {
      let query = this.queryGroup
      this.getUnmanagedGroup(query).then(rs => {
        this.groups = rs.data.results
        this.count = rs.data.count
        this.mode = 'unmanaged'
      }).catch(e => {
        console.log('error', e)
      })
    },
    getMyGroups () {
      let query = this.queryGroup
      this.getManageGroup(query).then(rs => {
        this.groups = rs.data.results
        this.count = rs.data.count
        this.mode = 'managed'
      }).catch(e => {
        console.log('error', e)
      })
    },
    getApis () {
      let query = this.queryApi
      this.getApisByGroupManager(query).then(v => {
        this.manageApi.apis = v.data.results
        this.apiCount = v.data.count
      }).catch(e => {
        console.log('error', e)
      })
    },
    groupDelete (group) {
      const index = R.findIndex(a => a === group)(this.groups)
      this.groups.splice(index, 1)
    },
    manageGroup (group) {
      this.group = group
      this.showGroupEdit = true
    },
    manageGroupApi (group) {
      let { _id: groupId, name: groupName } = group
      this.queryApi.groupId = groupId
      this.manageApi.title = `${groupName}`
      this.getApis()
    },
    updateGroup (group) {
      this.getMyGroups()
    },
    changeForGroups (page) {
      this.queryGroup.page = page
      if (this.mode === 'managed') {
        this.getMyGroups()
      } else {
        this.getUnmanaged()
      }
    },
    changeForApis (page) {
      this.queryApi.page = page
      this.getApis()
    },
    async queryGroups (val) {
      this.queryGroup.q = val
      this.queryGroup.page = 1
      if (this.mode === 'managed') {
        this.getMyGroups()
      } else {
        this.getUnmanaged()
      }
    },
    queryApis (val) {
      this.queryApi.q = val
      this.queryApi.page = 1
      this.getApis()
    }
  },
  mounted () {
    this.getMyGroups()
  }
}
</script>
<style lang="less" scoped>
.mode-switch {
  margin-bottom: 20px;
}
.managed .managed,
.unmanaged .unmanaged {
  color: #20a0ff;
  border-color: #20a0ff;
}
.api-manage {
  position: relative;
  margin-top: 20px;
  border-top: 1px solid #ddd;
  &:before {
    content: "API 管理";
    position: absolute;
    left: 0px;
    top: -25px;
    font-size: 16px;
    color: #ccc;
    background-color: #f9fafc;
  }
}
.searchWrapper {
  position: relative;
  overflow: hidden;
  .api-search {
    margin-top: 20px;
    float: right;
    width: 16.6%;
  }
}
</style>
