<template>
  <div>
    <params :params="params"
            :name="name"
            @updateParams="changeParams"></params>
    <params :params="reqParams"
            :name="name"
            mode="fill"
            @updateParams="changeReqParams"></params>
  </div>
</template>

<script>
import Params from '../params/Index'
import R from 'ramda'
export default {
  components: {
    Params
  },
  props: ['params', 'name'],
  methods: {
    changeParams (data) {
      const key = `options.params.${this.name}`
      this.$store.commit('UPDATE_API_PROPS', [key, R.clone(data)])
    },
    changeReqParams (data, value) {
      this.$store.commit('UPDATE_REQ_PARAMS', {
        type: this.name,
        params: R.clone(data),
        value
      })
      this.reqParams = R.clone(data)
    },
    getReqParams (param) {
      this.buildReqParams(param)
      return param
    },
    buildReqParams (param) {
      if (param.type === 'object' && param.params) {
        param.params.map(p => this.buildReqParams(p))
      }
      param.value = ''
    }
  },
  computed: {
    reqParams: {
      get () {
        return R.clone(this.params)
      }
    }
  }
}
</script>
<style>
</style>
