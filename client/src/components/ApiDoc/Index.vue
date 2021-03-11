<template>
  <div class="api-doc" :id="api._id">
    <div class="fields">
      <div class="field name">
        <h2>
          <label :class="diffStyle('name')">{{api.name}}</label>
          <span class="method" :class="methodStyle">{{method}}</span>
          <label class="author">接口作者：{{api.author}}</label>
          <el-tag type="warning" v-if="api.status !== 1" class="block" size="small">{{api.status | status}}</el-tag>
        </h2>
        <div class="control" v-if="!isPreview && !diffMode">
          <el-button class="follow" @click="confirmCopy()">复制</el-button>
          <el-button class="follow" @click="diff()">历史对比</el-button>
          <el-button class="follow"
                     icon="el-icon-star-on"
                     v-if="followed"
                     type="primary"
                     @click="cancelfollow()">取消订阅</el-button>
          <el-button class="follow"
                     icon="el-icon-star-off"
                     v-else
                     @click="doFollow()">订阅</el-button>
          <el-button type="primary" class="edit" icon="el-icon-edit" @click="edit()">编辑</el-button>
          <!-- 更多操作 -->
          <el-dropdown @command="copyNameAndURL">
            <el-button type="primary">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item>复制接口名称和地址</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="field url">
        <div>
          <label>Mock地址：</label>
          <copy-field :value="api.url ? interFacePath : oldUrl"></copy-field>
          <span class="tip" v-if="api.url">也可沿用下方基于api hash的mock地址（不推荐）</span>
        </div>
        <div v-if="api.url" style="opacity: 0.6;">
          <label>hash模式Mock地址：</label>
          <copy-field :value="oldUrl"></copy-field>
        </div>
        <div v-if="api.devUrl" :class="diffStyle('devUrl')">
          <label>测试地址：</label>
          <copy-field :value="api.devUrl"></copy-field>
        </div>
        <div v-if="api.prodUrl" :class="diffStyle('prodUrl')">
          <label>线上地址：</label>
          <copy-field :value="api.prodUrl"></copy-field>
        </div>
      </div>
      <div class="field">
        <label>提交参数</label>
        <schema v-for="(schema, key) in schemaParams"
                :diff-mode="diffMode"
                :diff-stack="diffStack"
                :diff-path="'options.params.' + key"
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
        <schemas :schemas="api.options.response"
                 name="response"
                 :diff-mode="diffMode"
                 :diff-stack="diffStack"
                 :diff-path="'options.response'"></schemas>
      </div>
      <div class="field mock-data" v-else>
        <label>Mock数据</label>
        <mock-data :mock-data="api.dsl"></mock-data>
      </div>
      <div class="field desc" v-show="api.desc">
        <label>其他备注</label>
        <div class="editor-style" v-html="api.desc" :class="diffStyle('desc')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { urlJoin } from '@/util'
// 为了接口描述在文档中显示的跟编辑时样式一致而引入
import 'simditor/styles/simditor.css'
import CopyField from '@/components/common/CopyField'
import { getDiffStyle } from '@/util/jsonDiff'
import ParamsTable from './ParamsTable'
import Schemas from './Schemas'
import Schema from './Schema'
import MockData from './MockData'
import copyToClickBoard from '@/util/copyToClickBoard'
import R from 'ramda'
export default {
  components: {
    CopyField,
    Schemas,
    Schema,
    ParamsTable,
    MockData
  },
  props: {
    diffStack: {
      type: Object,
      required: false
    },
    api: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions([
      'follow',
      'unfollow',
      'getGroup'
    ]),
    diffStyle (path) {
      return getDiffStyle(this.diffStack, path)
    },
    diff () {
      this.$router.push(`/diff/${this.api.group}/${this.api._id}`)
    },
    edit () {
      this.$store.commit('doc/UPDATE_API', this.api)
      this.$store.commit('doc/CHANGE_MODE', 'edit')
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
    jointUrl (mockUrl) {
      return mockUrl
    },
    cancelfollow () {
      this.unfollow(this.api._id).then(rs => {
        this.api.follower = rs.data.follower
      })
    },
    getApiCopyData (data) {
      const api = R.clone(data)
      delete api._id
      delete api.createTime
      delete api.modifiedTime
      api.name = `${api.name}-副本`
      return api
    },
    confirmCopy () {
      let api = this.api
      this.$confirm(`确定复制接口：${api.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.copyApi(api)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消复制'
        })
      })
    },
    copyApi (api) {
      const copyApi = this.getApiCopyData(api)
      this.$router.push({
        name: 'Create',
        query: {
          groupId: copyApi.group
        },
        params: copyApi
      })
    },
    copyNameAndURL () {
      const content = `接口名称：${this.api.name}  接口地址：${window.location.href}`
      copyToClickBoard(content, () => {
        this.$message.success('接口名称和地址已经成功复制到剪贴板中')
      })
    }
  },
  created () {
    const groupId = this.$route.query.groupId || this.$route.params.groupId
    if (groupId) {
      this.getGroup(groupId)
    }
  },
  beforeDestroy () {
    // this.SET_GROUP_DETAIL({})
  },
  computed: {
    ...mapMutations(['SET_GROUP_DETAIL']),
    ...mapState(['serverRoot', 'groupDetail']),
    ...mapState(['user', 'diffMode']),
    followed () {
      return !!this.api.follower.find(f => f === this.user._id)
    },
    isPreview () {
      return !!this.$route.query.preview
    },
    interFacePath () {
      const interFacePath = urlJoin(this.serverRoot, 'client', this.api.group, this.api.url)
      return this.jointUrl(interFacePath)
    },
    oldUrl () {
      const path = this.api.options.params.path
      if (path && path.length) {
        const pathUrl = path.filter(p => p.key).map(p => `/:${p.key}`).join('')
        return pathUrl ? `${this.url}${pathUrl}` : this.url
      } else {
        return this.url
      }
    },
    url () {
      const mockUrl = `${this.serverRoot}/client/${this.api._id}`
      return this.jointUrl(mockUrl)
    },
    method () {
      return this.api.options.method.toUpperCase()
    },
    methodStyle () {
      return {
        ...this.diffStyle('options.method'),
        [this.method]: true
      }
    },
    schemaParams () {
      const schemas = {}
      const _options = this.api.options
      for (const key in _options.params) {
        // get方法没有body参数
        // if (this.method === 'GET' && key === 'body') {
        //   continue
        // }
        if (this.hasParams(_options.params[key])) {
          schemas[key] = {
            example: _options.examples[key],
            params: _options.params[key]
          }
        }
      }
      delete schemas.path
      return schemas
    },
    headers () {
      return this.api.options.headers
    }
  }
}
</script>
<style lang="less">
.diff {
  position: relative;

  &-delete {
    *, & {
      background-color: #ffeef0 !important;
      text-decoration: line-through;
    }
  }
  &-add {
    *, & {
      background-color: #e6ffed !important;
    }
  }
  &-update {
    *, & {
      background-color: #aefbc4 !important;
    }
  }
}

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

  .tip {
    line-height: 30px;
    padding-left: 15px;
    color: #e6a23c;
    font-size: 12px;
  }

  h2 {
    font-weight: bold;
    padding: 10px 0;
    margin-right: 320px;
    display: flex;
    align-items: center;
    line-height: 30px;
    label {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .block{
      margin: 0 15px;
    }
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
    margin-bottom: 20px;
    border-bottom: 1px solid #ececec;

    &.name .control {
      position: absolute;
      right: 0px;
      top: 3px;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &.url {
      &>div {
        padding-left: 130px;
        position: relative;
        margin-bottom: 20px;

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
.author {
  margin-left: 30px;
}
</style>
