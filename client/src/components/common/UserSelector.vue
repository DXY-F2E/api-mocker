<template>
<el-select
  class="user-selector"
  :value="value"
  multiple
  filterable
  remote
  @remove-tag="itemRemove"
  :placeholder="placeholder"
  :remote-method="remoteMethod"
  :loading="loading">
  <el-option
    v-for="item in options"
    @click.native="itemClick(item._id)"
    :key="item._id"
    :label="item.name"
    :value="item._id">
    {{getUserLabel(item)}}
  </el-option>
</el-select>
</template>

<script>
export default {
  props: {
    remoteMethod: Function,
    placeholder: {
      type: String,
      default: '请输入进行搜索选择'
    },
    loading: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: []
    },
    options: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      localValue: this.value
    }
  },
  methods: {
    getUserLabel (item) {
      return `${item.name}（${item.email}）`
    },
    itemClick (val) {
      this.$emit('itemClick', val)
    },
    itemRemove (val) {
      this.$emit('itemRemove', val.value)
    }
  }
}
</script>
<style>
.user-selector {
  display: block;
}
</style>
