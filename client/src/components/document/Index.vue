<template>
 <div class="content">
  <el-row type="flex" class="list-content">
    <api-list :apis="apis" v-side-bar></api-list>
    <router-view :apis="apis" v-if="apis.length"></router-view>
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
      api: {},
      apis: []
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
      const query = {
        page: 1,
        limit: 10000
      }
      this.$http.get(API.GROUP_APIS.replace(':groupId', route.params.groupId), {
        params: query
      }).then(rs => {
        this.apis = rs.data.resources
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    // 切换不同组的文档，需重新获取下apis
    if (to.params.groupId !== from.params.groupId) {
      this.getApis(to)
    }
    next()
  },
  mounted () {
    this.getApis(this.$route)
  }
}
</script>
<style>
</style>
