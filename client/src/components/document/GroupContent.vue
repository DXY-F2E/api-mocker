<template>
  <div class="apis-doc" v-if="group">
    <div class="title">
      {{group.name}}接口文档
    </div>
    <api-doc :api="api" v-for="api in apis" :key="api._id"></api-doc>
  </div>
</template>

<script>
import ApiDoc from './apiDoc/Index'
export default {
  components: {
    ApiDoc
  },
  computed: {
    groups () {
      return this.$store.state.groups
    },
    group () {
      return this.groups.find(g => g._id === this.$route.params.groupId)
    }
  },
  props: ['apis']
}
</script>
<style>
.apis-doc > .title {
  padding: 30px;
  font-size: 28px;
  border-bottom: 1px solid #ddd;
}
</style>
