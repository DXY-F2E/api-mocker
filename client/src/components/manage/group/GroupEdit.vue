<template>
<el-dialog :title="title" :visible="visible" @open="initLocalGroup" :show-close="false">
  <el-form v-stop-default-enter label-position="right" label-width="84px">
    <el-form-item label="群名称：">
      <el-input v-model="localGroup.name"></el-input>
    </el-form-item>
    <el-form-item label="隐私性：">
      <el-radio-group v-model="localGroup.privacy">
        <el-radio :label="0">所有人可见</el-radio>
        <el-radio :label="1">组内成员可见</el-radio>
        <el-radio :label="3">自己可见</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="接口操作：">
      <el-radio-group v-model="localGroup.operation">
        <el-radio :label="0">所有人可操作</el-radio>
        <el-radio :label="1">组内成员可操作</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="组内成员：">
      <user-selector
        class="group-member"
        :value="localGroup.member"
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
    group: Object,
    visible: Boolean
  },
  data () {
    return {
      localGroup: R.clone(this.group),
      users: []
    }
  },
  mounted () {
    this.initUsers()
  },
  computed: {
    allUsers () {
      return this.$store.state.allUsers
    },
    title () {
      return `${this.localGroup.name}`
    }
  },
  methods: {
    initUsers () {
      this.users = this.localGroup.member.map(id =>
        this.allUsers.find(u => u._id === id)
      )
    },
    searchUsers (val) {
      this.users = this.allUsers.filter(u =>
        u.email.indexOf(val) >= 0 || u.name.indexOf(val) >= 0
      )
    },
    itemClick (val) {
      this.localGroup.member = R.symmetricDifference(this.localGroup.member, [val])
    },
    itemRemove (val) {
      this.localGroup.member = R.without([val], this.localGroup.member)
    },
    initLocalGroup () {
      this.localGroup = R.clone(this.group)
      this.initUsers()
    },
    cancel () {
      this.$emit('hide')
    },
    confirm () {
      this.$store.dispatch('updateGroup', this.localGroup).then(rs => {
        this.$message.success('更新成功')
        this.$emit('update', rs.data)
        this.$emit('hide')
      }).catch(err => this.$message.error(err.msg))
    }
  }
}
</script>
