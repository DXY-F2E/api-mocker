<template>
  <simditor id="desc-editor" placeholder="其他备注" v-model="desc" @change="updateDesc"></simditor>
</template>

<script>
import Simditor from '@/components/common/Simditor'

export default {
  components: {
    Simditor
  },
  methods: {
    updateDesc (val) {
      this.$store.commit('UPDATE_API_PROPS', ['desc', val])
    }
  },
  computed: {
    desc () {
      return this.$store.state.api.desc
    }
  }
}
</script>
<style>
#desc-editor {
  min-height: 200px;
}
</style>
