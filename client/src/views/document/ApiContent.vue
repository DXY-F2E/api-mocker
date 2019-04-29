<template>
  <div class="apis-doc">
    <api-doc :api="api" v-if="api"></api-doc>
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
    }
  },
  mounted () {
    this.getApi(this.$route)
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
