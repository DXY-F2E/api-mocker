<template>
  <el-input :value="value" :readonly="true" v-on:focus="handleCopy" ref="copyInput" :placeholder="placeholder">
    <template slot="prepend" v-on:click.stop.prevent="() => {}" v-if="prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="append"><el-button @click="handleCopy">复制</el-button></template>
  </el-input>
</template>

<script>
export default {
  props: {
    prepend: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleCopy () {
      if (!this.value) return
      this.$refs.copyInput.select()
      document.execCommand('copy')
      this.$message({
        type: 'success',
        message: '复制成功',
        duration: 1000
      })
    }
  }
}
</script>
