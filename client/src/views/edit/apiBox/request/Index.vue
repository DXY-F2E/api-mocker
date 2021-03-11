<template>
  <el-row type="flex" class="request-box">
    <el-col class="types">
      <div class="control">Types</div>
      <ul>
        <li class="item"
            :class="[{active: activeType === r.name}]"
            v-for="(r, key) in types"
            :key="key"
            @click="changeSchema(r.name)">
          <span>
            {{r.label}}
            <el-tooltip v-if="r.tip"
                        :content="r.tip"
                        placement="top">
              <span class="mocker-tip">?</span>
            </el-tooltip>
          </span>
        </li>
        <li class="item"
            :class="[{active: activeType === 'headers'}]"
            key="headers"
            @click="changeSchema('headers')">
          <span>Header</span>
        </li>
      </ul>
    </el-col>
    <el-col class="schema-content">
      <schema :schema="activeSchema"
              :name="activeType"
              :fullscreen="fullscreen"
              @change="updateParams"></schema>
    </el-col>
  </el-row>
</template>

<script>
import R from 'ramda'
import { mapState } from 'vuex'
import Schema from '../schema/Index'

export default {
  components: {
    Schema
  },
  props: ['fullscreen', 'method'],
  data () {
    return {
      activeType: this.initActive(),
      types: [{
        label: 'Body',
        name: 'body',
        tip: '请求体参数，支持form、json'
      }, {
        label: 'Query',
        name: 'query',
        tip: 'url中的query参数，以 ? 和 & 拼接到url中'
      }]
    }
  },
  methods: {
    initActive () {
      if (this.method === 'get') {
        return 'query'
      } else {
        return 'body'
      }
    },
    updateParams (data) {
      if (this.activeType === 'headers') {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.headers', data])
        this.$store.commit('doc/SET_API_CHANGED')
        return
      }
      const key = `options.params.${this.activeType}`
      this.$store.commit('doc/UPDATE_API_PROPS', [key, data.params])
      const exampleKey = `options.examples.${this.activeType}`
      this.$store.commit('doc/UPDATE_API_PROPS', [exampleKey, data.example])
    },
    changeSchema (type) {
      this.activeType = type
    },
    getSchemaObject (key) {
      return {
        example: this.examples[key],
        params: this.params[key]
      }
    },
    setOptions (key, params, example) {
      this.$store.commit('doc/UPDATE_API_PROPS', [`options.params.${key}`, params])
      this.$store.commit('doc/UPDATE_API_PROPS', [`options.example.${key}`, example])
    }
  },
  watch: {
    method (val, oldVal) {
      if (this.activeType === 'headers') {
        return
      }
      if (val === 'get') {
        this.activeType = 'query'
        // if (oldVal) {
        //   let {example, params} = this.localParams.body
        //   this.setOptions('query', params, example)
        // }
      } else {
        this.activeType = 'body'
        // if (oldVal === 'get') {
        //   let {example, params} = this.localParams.query
        //   this.setOptions('body', params, example)
        // }
      }
    }
  },
  computed: {
    ...mapState('doc', ['api']),
    activeSchema () {
      return this.activeType === 'headers' ? this.headers : this.localParams[this.activeType]
    },
    apiOptions () {
      return this.api.options
    },
    headers () {
      return this.apiOptions.headers
    },
    params () {
      return R.clone(this.apiOptions.params)
    },
    examples () {
      return R.clone(this.apiOptions.examples)
    },
    localParams () {
      const localParams = {query: {}, body: {}, path: {}}
      for (const key in this.params) {
        localParams[key] = this.getSchemaObject(key)
      }
      return localParams
    }
  }
}
</script>
<style lang="less">
.request-box {
  height: 300px;

  .el-col.types {
    position: relative;
    min-width: 150px;
    max-width: 150px;
    height: 100%;
  }
  .types {
    .control {
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-bottom: 1px solid #d1dbe5;
    }
    .item {
      border-bottom: 1px solid #eee;
      padding: 8px 10px;
      cursor: pointer;
      height: 36px;
      overflow: hidden;
      color: #79818b;

      &.active {
        background-color: #fafafa;
        color: #333;
      }

      &:hover .mocker-tip {
        display: inline-block;
      }
      .mocker-tip {
        margin: 2px 3px 0 0;
        float: right;
        background-color: #bfcbd9;
        display: none;
      }
    }
  }
}

</style>
