<template>
  <simditor id="desc-editor" placeholder="其他备注" v-model="desc" @change="updateDesc"></simditor>
</template>

<script>
import Simditor from '@/components/common/Simditor'
import { mapState } from 'vuex'

export default {
  components: {
    Simditor
  },
  methods: {
    updateDesc (val) {
      this.$store.commit('doc/UPDATE_API_PROPS', ['desc', val])
    }
  },
  computed: {
    ...mapState('doc', ['api']),
    desc () {
      return this.api.desc
    }
  }
}
</script>
<style>
#desc-editor {
  min-height: 200px;
}
</style>
