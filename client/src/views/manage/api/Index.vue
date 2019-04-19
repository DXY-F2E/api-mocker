<template>
  <div class="manage-api">
    <div class="title">我创建的 API</div>
    <api-manage :apis="apis"></api-manage>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ApiManage from './ApiManage'

export default {
  components: {
    ApiManage
  },
  data () {
    return {
      apis: []
    }
  },
  methods: {
    ...mapActions(['getManageApi']),
    async getApis () {
      this.apis = (await this.getManageApi()).data
    }
  },
  mounted () {
    this.getApis()
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 20px;
  margin: 20px 0;
}
</style>
