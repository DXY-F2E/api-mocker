<template>
  <div class="api-box">
    <!-- URL -->
    <div class="url-box">
      <el-row type="flex" :gutter="20">
        <el-col :span="18">
          <copy-field :value="url" placeholder="Url保存后自动生成" :prepend="true">
            <el-select v-model="method" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="get"></el-option>
              <el-option label="POST" value="post"></el-option>
              <el-option label="PUT" value="put"></el-option>
              <el-option label="PATCH" value="patch"></el-option>
              <el-option label="DELETE" value="delete"></el-option>
            </el-select>
          </copy-field>
        </el-col>
        <el-col :span="6">
          <el-button id="saveAct" type="primary" @click="save()" v-if="mode === 'edit'"></el-button>
          <template v-if="api._id">
            <el-button @click="showDoc" v-if="mode === 'edit'">文档模式</el-button>
          </template>
        </el-col>
      </el-row>
    </div>
    <!-- Request -->
    <setting-field title="Request">
      <template slot-scope="props">
        <request-box :fullscreen="props.fullscreen" :method="method"></request-box>
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { throttle } from '@/util'
import CopyField from '@/components/common/CopyField'
import RequestBox from './request/Index'
import Response from './response/Index'
import ResponseConfig from './response/Config'
import ResultBox from './ResultBox'
import DescBox from './DescBox'
import SettingField from './SettingField'

export default {
  components: {
    RequestBox,
    Response,
    ResponseConfig,
    ResultBox,
    DescBox,
    SettingField,
    CopyField
  },
  data () {
    return {
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
    onKeydown (e) {
      if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.save()
      }
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
    getTestUrl (mode) {
      return this[`${mode}Url`]
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeydown)
  },
  mounted () {
    document.addEventListener('keydown', this.onKeydown)
  },
  computed: {
    ...mapState(['serverRoot']),
    ...mapState('doc', ['api', 'mode']),
    response () {
      return this.api.options.response
    },
    modeName () {
      return this.mode === 'edit' ? '编辑' : '测试'
    },
    creating () {
      return this.api._id === undefined
    },
    mockUrl () {
      const mockUrl = `${this.serverRoot}/client/${this.api._id}`
      const path = this.api.options.params.path
      if (path.length) {
        const pathUrl = path.filter(p => p.key).map(p => `/:${p.key}`).join('')
        return pathUrl ? `${mockUrl}${pathUrl}` : mockUrl
      } else {
        return mockUrl
      }
    },
    prodUrl () {
      return this.api.prodUrl
    },
    devUrl () {
      return this.api.devUrl
    },
    url () {
      if (this.mode === 'edit') {
        return this.api._id ? this.mockUrl : ''
      } else {
        return this.getTestUrl(this.testMode)
      }
    },
    method: {
      get () {
        return this.api.options.method
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.method', value])
      }
    }
  }
}
</script>
<style lang="less">
.api-box {
  width: 100%;
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
