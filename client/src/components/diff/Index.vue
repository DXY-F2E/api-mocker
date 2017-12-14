<template>
  <div>历史对比</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data: () => ({
    histories: []
  }),
  methods: {
    ...mapActions(['getApiHistory'])
  },
  created () {
    console.log(this.$route)
    const apiId = this.$route.params.apiId
    this.getApiHistory(apiId).then(console.log)
  }
}
</script>
