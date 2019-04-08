<template>
  <el-input :value="value" :readonly="true" @click.native="handleCopy">
    <template slot="append">点击复制</template>
  </el-input>
</template>

<script>
import { copy } from '@/util'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleCopy () {
      copy(this.value)
      this.$message({
        type: 'success',
        message: '复制成功',
        duration: 1000
      })
    }
  }
}
</script>
