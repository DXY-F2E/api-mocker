<template>
  <el-autocomplete
    v-model="bindValue"
    :fetch-suggestions="search"
    :placeholder="placeholder"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script>
import API from '@/config/api'
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索用户'
    }
  },
  computed: {
    bindValue: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    async search (query, cb) {
      let res = await this.$http(API.USER_SEARCH, { params: { query } })
      let userList = res.data.map(item => ({
        value: item.name,
        id: item._id
      }))
      cb(userList)
    },
    handleSelect (item) {
      this.$emit('select', item)
    }
  }
}
</script>
