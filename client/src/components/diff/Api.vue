<template>
  <div>
    <api-doc :api="api" v-if="api" :diff-stack="diffStack" :diff-mode="diffMode"></api-doc>
    <div class="empty" v-else>无此记录</div>
  </div>
</template>
<script>
import ApiDoc from '@/components/document/apiDoc/DiffDoc'
export default {
  components: {
    ApiDoc
  },
  props: {
    diffStack: {
      type: Object,
      required: false
    },
    diffMode: {
      type: Boolean,
      default: false
    },
    api: {
      type: Object,
      required: false
    },
    apis: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>
