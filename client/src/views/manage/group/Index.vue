<template>
<div class="manage-group">
  <div class="mode-switch" :class="mode">
    <el-button size="small" class="managed" @click.native="getMyGroups">我的分组</el-button>
    <el-button size="small" class="unmanaged" @click.native="getUnmanaged">未认领分组</el-button>
  </div>
  <div class="group-table">
    <el-table :data="groups" style="width: 100%">
      <el-table-column prop="name" label="分组名">
      </el-table-column>
      <el-table-column prop="createTime" :formatter="timeFormat" width="200" label="创建时间">
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <control :group="scope.row" :mode="mode" @delete="groupDelete" @manage="manageGroup" @api-manage="manageGroupApi"></control>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <api-manage v-if="manageApi.title" :apis="manageApi.apis" :title="manageApi.title" class="api-manage"></api-manage>
  <group-edit v-if="group"
              :visible="showGroupEdit"
              :group="group"
              @update="updateGroup"
              @hide="showGroupEdit = false">
  </group-edit>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import Control from './GroupControl'
import GroupEdit from './GroupEdit'
import ApiManage from '../api/ApiManage'
import R from 'ramda'
export default {
  components: {
    Control,
    GroupEdit,
    ApiManage
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
      }
    }
  },
  methods: {
    ...mapActions([
      'getManageGroup',
      'getUnmanagedGroup',
      'getApisByGroupManager'
    ]),
    timeFormat (row, col) {
      return moment(new Date(Number(row[col.property]))).format('YYYY-MM-DD HH:mm:ss')
    },
    getUnmanaged () {
      this.getUnmanagedGroup().then(rs => {
        this.groups = rs.data
        this.mode = 'unmanaged'
      })
    },
    getMyGroups () {
      this.getManageGroup().then(rs => {
        this.groups = rs.data
        this.mode = 'managed'
      })
    },
    groupDelete (group) {
      const index = R.findIndex(a => a === group)(this.groups)
      this.groups.splice(index, 1)
    },
    manageGroup (group) {
      window.console.log(group)
      this.group = group
      this.showGroupEdit = true
    },
    async manageGroupApi (group) {
      let { _id: groupId, name: groupName } = group
      this.manageApi.title = `${groupName}`
      this.manageApi.apis = (await this.getApisByGroupManager(groupId)).data
    },
    updateGroup (group) {
      // window.console.log(group)
      // const index = R.findIndex(R.propEq('_id', group._id))(this.groups)
      // this.$set(this.groups, index, group)
      this.getMyGroups()
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
  margin-top: 40px;
  border-top: 1px solid #ddd;
  &:before {
    content: "API 管理";
    position: absolute;
    left: 40px;
    top: -12px;
    font-size: 16px;
    color: #ccc;
    background-color: #f9fafc;
  }
}
</style>
