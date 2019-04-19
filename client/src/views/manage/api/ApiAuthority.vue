<template>
<el-dialog :title="title" :visible="visible" @open="getApiAuthority" :show-close="false">
  <el-form v-if="authority" v-stop-default-enter label-position="left" label-width="84px">
    <el-form-item label="编辑权限：">
      <el-radio-group v-model="authority.operation.mode">
        <el-radio :label="0">所有人</el-radio>
        <el-radio :label="1">组内人员</el-radio>
        <el-radio :label="2">指定人员</el-radio>
      </el-radio-group>
      <user-selector
        class="api-operator"
        v-show="authority.operation.mode === 2"
        :value="operator"
        :remoteMethod="searchUsers"
        :options="users"
        @itemRemove="itemRemove"
        @itemClick="itemClick">
      </user-selector>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import UserSelector from '@/components/common/UserSelector'
import R from 'ramda'
export default {
  components: {
    UserSelector
  },
  props: {
    api: Object,
    visible: Boolean
  },
  data () {
    return {
      users: [],
      authority: null
    }
  },
  computed: {
    allUsers () {
      return this.$store.state.allUsers
    },
    title () {
      return `${this.api.name}`
    },
    operator () {
      return this.authority.operation.operator
    }
  },
  methods: {
    initUsers (operators) {
      this.users = operators.map(id =>
        this.allUsers.find(u => u._id === id)
      )
    },
    getApiAuthority () {
      this.$store.dispatch('getApiAuthority', this.api._id).then(rs => {
        this.initUsers(rs.data.operation.operator)
        this.authority = rs.data
      })
    },
    searchUsers (val) {
      this.users = this.allUsers.filter(u =>
        u.email.indexOf(val) >= 0 || u.name.indexOf(val) >= 0
      )
    },
    updateOperator (operators) {
      this.authority.operation.operator = operators
    },
    cancel () {
      this.$emit('hide')
    },
    confirm () {
      if (this.authority.operation.mode === 2 && this.operator.length === 0) {
        this.$message.error('请至少选择一个人')
        return
      }
      this.$store.dispatch('updateApiAuthority', this.authority).then(rs => {
        this.$message.success(rs.data)
        this.$emit('hide')
      }).catch(err => this.$message.error(err.msg))
    },
    itemClick (val) {
      // 如果存在则移除，如果不存在则添加
      this.authority.operation.operator = R.symmetricDifference(this.authority.operation.operator, [val])
    },
    itemRemove (val) {
      this.authority.operation.operator = R.without([val], this.authority.operation.operator)
    }
  }
}
</script>
<style>
.api-operator {
  width: auto;
  display: block;
  margin-top: 10px;
}
</style>
