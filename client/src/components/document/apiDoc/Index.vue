<template>
  <div class="api-doc" :id="api._id">
    <div class="fields">
      <div class="field name">
        <h2>{{api.name}}<span class="method" :class="method">{{method}}</span></h2>
        <div class="control" v-if="!isPreview">
          <el-button class="follow"
                     icon="star-on"
                     v-if="followed"
                     type="primary"
                     @click="cancelfollow()">取消订阅</el-button>
          <el-button class="follow"
                     icon="star-off"
                     v-else
                     @click="doFollow()">订阅</el-button>
          <el-button type="primary" class="edit" icon="edit" @click="edit()">编辑</el-button>
        </div>
      </div>
      <div class="field url">
        <div>
          <label><code>Mock</code>地址：</label>
          <p class="prod code">{{url}}</p>
        </div>
        <div v-if="api.devUrl">
          <label>测试地址：</label>
          <p class="prod code">{{api.devUrl}}</p>
        </div>
        <div v-if="api.prodUrl">
          <label>线上地址：</label>
          <p class="prod code">{{api.prodUrl}}</p>
        </div>
      </div>
      <div class="field">
        <label>提交参数</label>
        <schema v-for="(schema, key) in schemaParams"
                v-if="hasParams(schema.params)"
                :name="key"
                :schema="schema"
                :key="key"></schema>
      </div>
      <div class="field" v-if="headers.params.length">
        <label>请求头</label>
        <schema :schema="headers" name="headers"></schema>
      </div>
      <div class="field" v-if="api.options.response && api.options.response.length">
        <label>返回结果</label>
        <schemas :schemas="api.options.response" name="response"></schemas>
      </div>
      <div class="field mock-data" v-else>
        <label>Mock数据</label>
        <mock-data :mock-data="api.dsl"></mock-data>
      </div>
      <div class="field desc" v-show="api.desc">
        <label>其他备注</label>
        <div class="editor-style" v-html="api.desc"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ParamsTable from './ParamsTable'
import Schemas from './Schemas'
import Schema from './Schema'
import MockData from './MockData'
import CopyButton from '@/components/common/CopyButton'
import { mapActions } from 'vuex'
// 为了接口描述在文档中显示的跟编辑时样式一致而引入
import 'simditor/styles/simditor.css'
export default {
  components: {
    CopyButton,
    Schemas,
    Schema,
    ParamsTable,
    MockData
  },
  props: {
    api: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions([
      'follow',
      'unfollow'
    ]),
    edit () {
      this.$store.commit('UPDATE_API', this.api)
      this.$store.commit('CHANGE_MODE', 'edit')
      this.$router.push(`/edit/${this.api.group}/${this.api._id}`)
    },
    hasParams (params) {
      return params && params.filter(p => p.key).length > 0
    },
    doFollow () {
      this.follow(this.api._id).then(rs => {
        this.api.follower = rs.data.follower
      })
    },
    cancelfollow () {
      this.unfollow(this.api._id).then(rs => {
        this.api.follower = rs.data.follower
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    followed () {
      return !!this.api.follower.find(f => f === this.user._id)
    },
    isPreview () {
      return !!this.$route.query.preview
    },
    url () {
      const mockUrl = `${this.$store.state.serverRoot}/client/${this.api._id}`
      const path = this.api.options.params.path
      if (path.length) {
        const pathUrl = path.filter(p => p.key).map(p => `/:${p.key}`).join('')
        return pathUrl ? `${mockUrl}${pathUrl}` : mockUrl
      } else {
        return mockUrl
      }
    },
    method () {
      return this.api.options.method.toUpperCase()
    },
    schemaParams () {
      const schemas = {}
      for (const key in this.api.options.params) {
        // get方法没有body参数
        if (this.method === 'GET' && key === 'body') {
          continue
        }
        schemas[key] = {
          example: this.api.options.examples[key],
          params: this.api.options.params[key]
        }
      }
      return schemas
    },
    headers () {
      return this.api.options.headers
    }
  }
}
</script>
<style lang="less">
.apis-doc {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.api-doc {
  width: 100%;
  padding: 30px;

  &~.api-doc {
    border-top: 1px solid #ddd;
  }

  h2 {
    border-bottom: 1px solid #ececec;
    font-weight: bold;
    padding: 10px 0;
  }
  .code {
    border: 1px solid #e6e6e6;
    padding: 6px 10px;
    border-radius: 3px;
    color: #666;
    background-color: #f8f8f8;
  }

  .fields {
    width: 100%;
    min-width: 650px;
  }

  .method {
    color: #3eb63e;
    font-weight: normal;
    margin-left: 10px;
  }

  .field {
    width: 100%;
    position: relative;
    margin-bottom: 30px;

    &.name .control {
      position: absolute;
      right: 0px;
      top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &.url {
      &>div {
        padding-left: 75px;
        position: relative;
        margin-bottom: 10px;

        .code {
          word-break: break-all;
        }
      }
      label {
        position: absolute;
        left: 0;
        top: 10px;
      }
    }

    &>label {
      display: block;
      font-size: 16px;
      border-bottom: 1px solid #e6e6e6;
      line-height: 2;
      margin-bottom: 20px;
    }
  }
}
.method {
  &.put,
  &.PUT,
  &.PATCH,
  &.patch,
  &.post,
  &.POST {
    color: #f5a623;
  }
  &.get,
  &.GET {
    color: #3eb63e;
  }
}
</style>
