<template>
<div class="api-control">
  <template v-if="mode === 'managed'">
    <el-button type="text" size="small" @click="groupApiManage">api 管理</el-button>
    <el-button type="text" size="small" @click="groupManage">编辑</el-button>
    <el-button type="text" size="small" @click="groupDelete">删除</el-button>
  </template>
  <el-button type="text" size="small" @click="groupDoc">文档</el-button>
  <el-button type="text" size="small" @click="groupClaim" v-if="mode === 'unmanaged'">认领</el-button>
</div>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showAuthority: false
    }
  },
  methods: {
    groupClaim () {
      this.$store.dispatch('claimGroup', this.group._id).then(() => {
        this.$message.success('认领成功')
        this.$emit('delete', this.group)
      }).catch(err => this.$message.error(err.msg))
    },
    confirmDelete () {
      this.$store.dispatch('deleteGroup', this.group._id).then(() => {
        this.$message.success('删除成功')
        this.$emit('delete', this.group)
      }).catch(err => this.$message.error(err.msg))
    },
    groupApiManage () {
      this.$emit('api-manage', this.group)
    },
    groupManage () {
      this.$emit('manage', this.group)
    },
    groupDelete () {
      this.$confirm('分组内Api将一同删除，确定删除?', '提示', {
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
    groupDoc () {
      this.$router.push({
        name: 'GroupDoc',
        params: {
          groupId: this.group._id
        }
      })
    }
  }
}
</script>
<style>
</style>
