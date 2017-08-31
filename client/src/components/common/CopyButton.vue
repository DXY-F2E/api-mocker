<template>
  <el-button :size="size" :icon="icon" :disabled="disabled" @click.native.stop="copy()">
    <slot></slot>
  </el-button>
</template>

<script>
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
    copy () {
      const input = document.createElement('input')
      input.value = this.copyData
      input.className = 'copyInput'
      this.$el.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
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
