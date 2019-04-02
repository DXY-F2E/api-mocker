<template>
  <el-button :size="size" :icon="icon" :disabled="disabled" @click.native.stop="handleCopy()">
    <slot></slot>
  </el-button>
</template>

<script>
import { copy } from '@/util'

export default {
  props: {
    size: {
      type: String
    },
    icon: {
      type: String
    },
    copyData: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '复制成功'
    }
  },
  methods: {
    handleCopy () {
      copy(this.copyData)
      this.$message.success(this.message)
    }
  }
}
</script>
<style>
.el-button > .copyInput {
  position: fixed;
  left: -9999999;
}
</style>
