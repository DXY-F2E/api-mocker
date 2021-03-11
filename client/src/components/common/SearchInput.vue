<template>
    <el-input
        class="search"
        :placeholder="placeholder"
        prefix-icon="el-icon-search"
        :size="size"
        @change="handleChange"
        :clearable="true"
        @keydown.enter.native="handleQuery"
        v-model="inputValue">
    </el-input>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入条件'
    },
    size: {
      type: String
    },
    value: {
      type: String
    }
  },
  data () {
    return {
      inputValue: ''
    }
  },
  watch: {
    inputValue: function (val, old) {
      this.$emit('input', val)
    },
    value: function (val, old) {
      this.inputValue = this.value
    }
  },
  methods: {
    handleQuery () {
      this.$emit('query', this.inputValue)
    },
    handleChange (val) {
      if (val === '') {
        this.handleQuery()
      }
    }
  }
}
</script>
