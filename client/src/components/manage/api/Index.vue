<template>
  <div class="manage-api">
    <api-manage :apis="apis" title="我创建的 API"></api-manage>
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
    ...mapActions([
      'getManageApi'
    ]),
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
.api-list {
  h1 {
    margin: 20px 0;
  }
}
</style>
