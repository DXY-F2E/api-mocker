
<template>
  <ul class="history">
    <span>{{ author }}</span>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ApiAuthor',
  computed: {
    ...mapState('doc', ['api']),
    author () {
      return this.api.author || ''
    }
  }
}
</script>
<style lang="less">
.history {
  padding: 0 20px;
}
</style>
