<template>
  <div class="content api-diff">
    <div class="wrap">
      <div class="left">
        <api :api="leftApi"
             :diff-mode="true"
             title="历史接口"
             :apis="apis"
             @selectApi="handleSelectApi"></api>
      </div>
      <div class="right">
        <api :api="rightApi"
             :diff-stack="diffStack"
             :diff-mode="true"
             title="当前接口"></api>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import Api from './Api'
import jsonDiff from '@/util/jsonDiff'
export default {
  components: {
    Api
  },
  data: () => ({
    apis: [],
    leftApi: null,
    rightApi: null
  }),
  methods: {
    ...mapActions('doc', ['getApi', 'updateDiffStack', 'updateDiffMode']),
    buildApis (api) {
      if (!api.history) {
        return this.buildDiff(api, null)
      }
      this.apis = api.history.records.map(r => R.clone(r.data))
      delete api.history
      // 历史原因：1.2.1版本之前，保存接口是把当前保存的接口推入历史记录
      // 所以判断此接口与上一次接口modifiedTime一致时，就没必要再使用它了
      if (this.apis.length && this.apis[0].modifiedTime === api.modifiedTime) {
        this.apis.shift()
      }
      this.apis.reverse()
      this.buildDiff(api, this.apis[0])
    },
    buildDiff (rightApi, leftApi) {
      if (!leftApi) {
        this.rightApi = rightApi
        return
      }
      const { stack, value } = jsonDiff([rightApi, leftApi])
      this.leftApi = leftApi
      this.rightApi = value
      this.updateDiffStack(stack)
    },
    handleSelectApi (api) {
      this.buildDiff(this.api, api)
    }
  },
  computed: {
    ...mapState('doc', ['api', 'diffStack'])
  },
  created () {
    this.getApi(this.$route.params).then(() => this.buildApis(this.api))
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.updateDiffMode(true)
    })
  },
  beforeRouteLeave (to, from, next) {
    this.updateDiffMode(false)
    next()
  }
}
</script>
<style lang="less">
.api-diff {
  overflow-x: scroll;
  .wrap {
    min-width: 1420px;
    display: flex;
    overflow: scroll;
    & > div {
      flex: 1;
      width: 50%;
      border-right: 1px solid #eee;
    }
  }
}
</style>
