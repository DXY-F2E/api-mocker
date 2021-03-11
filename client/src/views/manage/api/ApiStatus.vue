<template>
  <el-dialog :title="api.name" :visible="visible" :show-close="false">
    <el-form v-stop-default-enter label-position="left" label-width="84px">
      <el-form-item label="接口状态：">
        <el-radio-group v-model="status">
          <el-radio :label=1>正常</el-radio>
          <el-radio :label=2>不再维护</el-radio>
          <el-radio :label=3>已下线</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('hide')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ApiStatus',
  props: {
    api: Object,
    visible: Boolean,
    default: () => ({ name: '编辑接口状态' })
  },
  data () {
    return {
      status: 1
    }
  },
  watch: {
    api: {
      handler (val, val1) {
        this.status = val.status
      },
      deep: true
    }
  },
  methods: {
    confirm () {
      this.$store.dispatch('updateApiStatus', { status: this.status, apiId: this.api._id }).then(rs => {
        this.$message.success(rs.data)
        this.$emit('hide', {reload: true})
      }).catch(err => this.$message.error(err.msg))
    }
  }
}
</script>
