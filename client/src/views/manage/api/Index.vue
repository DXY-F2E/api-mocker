<template>
  <div class="manage-api">
    <div class="title">我创建的 API</div>
    <api-manage></api-manage>
  </div>
</template>

<script>
import ApiManage from './ApiManage'

export default {
  components: {
    ApiManage
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 20px;
  margin: 20px 0;
}
</style>
