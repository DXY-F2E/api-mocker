<template>
  <el-row type="flex" class="request-box">
    <el-col class="types">
      <div class="control">Types</div>
      <ul>
        <li class="item"
            v-show="method !== 'get' || r.name !== 'body'"
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
import Schema from '../schema/Index'
import R from 'ramda'
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
        tip: 'POST、PUT请求时的参数，支持form、json'
      }, {
        label: 'Query',
        name: 'query',
        tip: 'Get请求时的url参数，以 ? 和 & 拼接到url中'
      }, {
        label: 'Path',
        name: 'path',
        tip: 'RESTful风格的url参数，例如 http://www.dxy.cn/:userId'
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
        this.$store.commit('UPDATE_API_PROPS', ['options.headers', data])
        return
      }
      const key = `options.params.${this.activeType}`
      this.$store.commit('UPDATE_API_PROPS', [key, data.params])
      const exampleKey = `options.examples.${this.activeType}`
      this.$store.commit('UPDATE_API_PROPS', [exampleKey, data.example])
    },
    changeSchema (type) {
      this.activeType = type
    },
    getSchemaObject (key) {
      return {
        example: this.examples[key],
        params: this.params[key]
      }
    }
  },
  watch: {
    method (val) {
      if (this.activeType === 'headers') {
        return
      }
      if (val === 'get') {
        this.activeType = 'query'
      } else {
        this.activeType = 'body'
      }
    }
  },
  computed: {
    activeSchema () {
      return this.activeType === 'headers' ? this.headers : this.localParams[this.activeType]
    },
    headers () {
      return this.$store.state.api.options.headers
    },
    params () {
      return R.clone(this.$store.state.api.options.params)
    },
    examples () {
      return R.clone(this.$store.state.api.options.examples)
    },
    localParams () {
      const localParams = {}
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
