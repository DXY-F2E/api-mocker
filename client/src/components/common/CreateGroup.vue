<template>
  <el-dialog title="创建Group" v-model="visited" :show-close="false" class="create-group-dialog">
    <el-form v-stop-default-enter>
      <el-input v-model="input" placeholder="输入分组名称"></el-input>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button type="default" @click="handleClickCancel">取消</el-button>
      <el-button type="primary" @click="handleClickAction" ref="create" :disabled="actionDisabled">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>

// emit: close,action
// props: visited
export default {
  props: {
    visited: {
      default: false,
      required: true
    }
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    handleClickAction () {
      this.$emit('action', this.input)
    },
    handleClickCancel () {
      this.input = ''
      this.$emit('close', this)
    }
  },
  watch: {
    visited (val) {
      if (!val) {
        this.$emit('close', this)
      }
    }
  },
  computed: {
    actionDisabled () {
      return !this.input
    }
  }
}
</script>
<style>
.create-group-dialog .el-input__inner {
 background: #fff;
}
</style>
