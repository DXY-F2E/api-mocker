<template>
 <div class="content" v-loading="loading">
  <el-row type="flex" class="list-content">
    <api-list ref="doc" :apis="apis" v-side-bar></api-list>
    <router-view :apis="apis" v-if="apis.length" :groupId="groupId" @reload="initApis"></router-view>
  </el-row>
 </div>
</template>
<script>
import ApiList from './ApiList'
import API from '@/config/api'
export default {
  components: {
    ApiList
  },
  data () {
    return {
      loading: false,
      api: {},
      apis: [],
      groupId: this.$route.params.groupId
    }
  },
  methods: {
    getApis (route) {
      if (route.name === 'AllDoc') {
        return
      }
      if (route.query.preview) {
        this.apis = JSON.parse(window.sessionStorage.getItem('_previewApis'))
        return
      }
      const query = { page: 1, limit: 10000, order: { name: 1 } }
      this.loading = true
      this.$http.get(API.GROUP_APIS.replace(':groupId', route.params.groupId), {
        params: query
      }).then(rs => {
        this.apis = rs.data.resources
        this.$refs.doc.$refs.apiList && this.$refs.doc.$refs.apiList.scrollTo(0, 0)
      }).finally(() => {
        this.loading = false
      })
    },
    initApis () {
      this.getApis(this.$route)
    }
  },
  beforeRouteUpdate (to, from, next) {
    // 切换不同组的文档，需重新获取下apis
    if (to.params.groupId !== from.params.groupId) {
      this.groupId = to.params.groupId
      this.getApis(to)
    }
    next()
  },
  mounted () {
    this.initApis()
  }
}
</script>
<style>
</style>
