<template>
  <div class="api-box">
    <!-- URL -->
    <div class="url-box">
      <el-row type="flex" :gutter="20">
        <el-col :span="18">
          <copy-field :value="interFaceUrl && api.group ? interFacePath : oldUrl" placeholder="Url保存后自动生成" :prepend="true">
            <el-select v-model="method" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="get"></el-option>
              <el-option label="POST" value="post"></el-option>
              <el-option label="PUT" value="put"></el-option>
              <el-option label="PATCH" value="patch"></el-option>
              <el-option label="DELETE" value="delete"></el-option>
            </el-select>
          </copy-field>
          <span class="tip" v-if="interFaceUrl && api.group && url">也可沿用下方基于api hash的mock地址（不推荐）</span>
        </el-col>
        <el-col :span="6">
          <el-button id="saveAct" type="primary" @click="submitSave()"></el-button>
          <template v-if="api._id">
            <el-button @click="showDoc">文档模式</el-button>
          </template>
        </el-col>
      </el-row>
     <div class="interface-path" v-if="interFaceUrl && api.group && url">
       <el-row style="opacity: 0.6;" type="flex" :gutter="20">
        <el-col :span="18">
          <copy-field :value="oldUrl" placeholder="接口路径" :prepend="true">
            <el-button class="button" slot="prepend"><span style="margin-left: -10px;">hash接口路径</span></el-button>
          </copy-field>
        </el-col>
      </el-row>
     </div>
    </div>
    <!-- Request -->
    <setting-field title="Request">
      <template slot-scope="props">
        <request-box :fullscreen="props.fullscreen" :method="method"></request-box>
      </template>
    </setting-field>
    <!-- Result -->
    <setting-field title="Result" v-if="mode === 'test'">
      <el-tabs v-model="resActive" slot="header" class="result-tabs">
        <el-tab-pane label="Body" name="body"></el-tab-pane>
        <el-tab-pane label="Headers" name="header"></el-tab-pane>
        <el-tab-pane label="All-Data" name="all"></el-tab-pane>
      </el-tabs>
      <template slot-scope="props">
        <result-box :fullscreen="props.fullscreen" :res-active="resActive"></result-box>
      </template>
    </setting-field>
    <!-- Response -->
    <setting-field title="Response" v-if="response" >
      <response-config slot="header"></response-config>
      <template slot-scope="props">
        <response :response="response" :fullscreen="props.fullscreen"></response>
      </template>
    </setting-field>
    <!-- Desc -->
    <setting-field title="Api Desc" >
      <desc-box></desc-box>
    </setting-field>
    <div class="postman-killer" @click="postmanKillerVisible = true">
      Postman<br>
      Killer!
    </div>
    <postman-killer
      :visible.sync="postmanKillerVisible"
    ></postman-killer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { throttle, urlJoin } from '@/util'
import CopyField from '@/components/common/CopyField'
import RequestBox from './request/Index'
import Response from './response/Index'
import ResponseConfig from './response/Config'
import ResultBox from './ResultBox'
import DescBox from './DescBox'
import SettingField from './SettingField'
import PostmanKiller from './PostmanKiller'

export default {
  components: {
    RequestBox,
    Response,
    ResponseConfig,
    ResultBox,
    DescBox,
    SettingField,
    CopyField,
    PostmanKiller
  },
  data () {
    return {
      postmanKillerVisible: false,
      resActive: 'all',
      saveToken: false,
      save: throttle(() => {
        if (this.saveToken) {
          return
        }
        this.saveToken = true
        this.saveApi().then(() => {
          this.saveToken = false
          if (this.$route.name === 'Create' && this.api._id) {
            this.$router.replace({
              name: 'Edit',
              params: {
                groupId: this.api.group,
                apiId: this.api._id
              }
            })
          }
          this.$message.success('保存成功')
        }).catch(err => {
          this.saveToken = false
          this.$message.error(`保存失败:${err.msg}`)
        })
      }, 3000)
    }
  },
  methods: {
    ...mapActions('doc', ['saveApi']),
    ...mapActions(['getGroup']),
    onKeydown (e) {
      if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.submitSave()
      }
    },
    submitSave () {
      // let {options} = this.api
      // let {method, params} = options
      // let {query} = params

      // 判断是否要弹窗提示非GET方法中含有Query参数
      // let showDelQueryDiglog = false
      // if (method !== 'get' && query && query.length) {
      //   for (let i = 0; i < query.length; i++) {
      //     let {key, required} = query[i]
      //     if (key && required) {
      //       showDelQueryDiglog = true
      //       break
      //     }
      //   }
      // }

      // if (showDelQueryDiglog) {
      //   this.$confirm('该请求非GET方法, 但检测到Query中又含有必填参数, 请问是否删除Query中的所有参数?', '提示', {
      //     confirmButtonText: '是', cancelButtonText: '否', type: 'warning'
      //   }).then(() => {
      //     this.$store.commit('doc/UPDATE_API_PROPS', ['options.params.query', []])
      //     this.$store.commit('doc/SET_API_CHANGED')
      //     this.save()
      //   }).catch(() => {
      //     this.save()
      //   })
      // } else {
      //   this.save()
      // }
      this.save()
    },
    showDoc () {
      this.$router.push({
        name: 'ApiDoc',
        params: {
          groupId: this.api.group,
          apiId: this.api._id
        }
      })
    },
    jointUrl (mockUrl) {
      // 不再拼接路径参数
      // const path = this.api.options.params.path
      // if (path.length) {
      //   const pathUrl = path.filter(p => p.key).map(p => `/:${p.key}`).join('')
      //   return pathUrl ? `${mockUrl}${pathUrl}` : mockUrl
      // } else {
      //   return mockUrl
      // }
      return mockUrl
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeydown)
  },
  mounted () {
    document.addEventListener('keydown', this.onKeydown)
  },
  created () {
    const groupId = this.$route.query.groupId || this.$route.params.groupId
    if (groupId) {
      this.getGroup(groupId)
    }
  },
  computed: {
    ...mapState(['serverRoot', 'groupDetail']),
    ...mapState('doc', ['api', 'mode']),
    oldUrl () {
      const path = this.api.options.params.path
      if (path && path.length) {
        const pathUrl = path.filter(p => p.key).map(p => `/:${p.key}`).join('')
        return pathUrl ? `${this.url}${pathUrl}` : this.url
      } else {
        return this.url
      }
    },
    response () {
      return this.api.options.response
    },
    creating () {
      return this.api._id === undefined
    },
    interFaceUrl () {
      return this.api.url
    },
    interFacePath () {
      const interFacePath = urlJoin(this.serverRoot, 'client', this.api.group, this.interFaceUrl)
      return this.jointUrl(interFacePath)
    },
    mockUrl () {
      const mockUrl = `${this.serverRoot}/client/${this.api._id}`
      return this.jointUrl(mockUrl)
    },
    prodUrl () {
      return this.api.prodUrl
    },
    devUrl () {
      return this.api.devUrl
    },
    url () {
      return this.api._id ? this.mockUrl : ''
    },
    method: {
      get () {
        return this.api.options.method
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.method', value])
        this.$store.commit('doc/SET_API_CHANGED')
      }
    }
  }
}
</script>
<style lang="less">
.postman-killer {
  color: #fff;
  text-align: center;
  position: fixed;
  line-height: 20px;
  padding-top: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50px;
  background-color: rgb(50, 65, 87);
  bottom: 70px;
  right: 70px;
  z-index: 1999;
  cursor: pointer;
  box-shadow: 0 0 3px #324157;
  transition: transform .2s;
  &:hover {
    transform: scale(1.1);
  }
}

.api-box {
  width: 100%;
  .tip {
    margin-left: 105px;
    line-height: 30px;
    padding-left: 15px;
    color: #e6a23c;
    font-size: 12px;
  }
}
.result-tabs.el-tabs {
  display: inline-block;
  margin: 0 0 -1px 30px;
  vertical-align: top;
}
.result-tabs .el-tabs__header {
  margin-bottom: 0;
}

.url-box {
  .interface-path {
    margin-top: 10px;
    .button {
      width: 105px;
    }
  }
  .mode-btn-group {
    min-width: 120px;
  }

  .el-select .el-input__inner {
    width: 104px;
  }

  .el-input__inner {
    &:hover,
    &:focus {
      border-color: #bfcbd9;
    }
  }
}

#editAct,
#saveAct {
  width: 91px;
}
#saveAct:after {
  content: "保存";
}
#saveAct:hover:after {
  content: "⌘ + S";
}
.el-select-dropdown__item.is-disabled.doc {
  cursor: pointer;
  color: #48576a;
}
.el-select-dropdown__item.is-disabled.doc:hover {
  /*background-color: #58B7FF;*/
  color: #58b7ff;
}
</style>
