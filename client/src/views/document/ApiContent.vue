<template>
  <div class="apis-doc">
    <api-doc :api="api" v-if="api" @reload="reload"></api-doc>
  </div>
</template>

<script>
import ApiDoc from '@/components/ApiDoc/Index'
export default {
  components: {
    ApiDoc
  },
  props: ['apis'],
  methods: {
    getApi (route) {
      this.api = this.apis.find(api => api._id === route.params.apiId)
      document.title = (this.api && this.api.name) || '未命名接口'
    },
    reload () {
      this.$emit('reload')
    }
  },
  mounted () {
    this.getApi(this.$route)
  },
  created () {
    this.originTitle = document.title
  },
  beforeDestroy () {
    document.title = this.originTitle
  },
  beforeRouteUpdate (to, from, next) {
    this.getApi(to)
    next()
  },
  data () {
    return {
      api: null
    }
  }
}
</script>
<style>
</style>
