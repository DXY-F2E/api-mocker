<template>
  <div class="url-box">
    <el-row type="flex" :gutter="20">
      <el-col :span="18">
        <copy-field :value="url" placeholder="Url保存后自动生成">
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
        <!-- 保存 -->
        <el-button id="saveAct" type="primary" @click="save()" v-if="mode === 'edit'"></el-button>
        <template v-if="api._id">
          <el-button @click="showDoc" v-if="mode === 'edit'">文档模式</el-button>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { throttle } from '@/util'
import { mapActions } from 'vuex'
import CopyField from '@/components/common/CopyField'

export default {
  components: {
    CopyField
  },
  data () {
    return {
      saveToken: false,
      isShowDialog: false,
      testMode: 'mock',
      testModes: ['mock', 'prod', 'dev'],
      save: throttle(() => {
        if (this.saveToken) {
          return
        }
        this.saveToken = true
        this.saveApi().then(() => {
          this.saveToken = false
          if (this.$route.name === 'Create' && this.api._id) {
            this.$router.push({
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
    ...mapActions([
      'saveApi',
      'testApi'
    ]),
    updateTestMode (val) {
      this.testMode = val
    },
    send () {
      this.testApi(this.testMode)
    },
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
    buildMockUrl () {
      const mockUrl = `${this.$store.state.serverRoot}/client/${this.api._id}`
      const path = this.api.options.params.path
      if (path.length) {
        const pathUrl = path.filter(p => p.key).map(p => `/:${p.key}`).join('')
        return pathUrl ? `${mockUrl}${pathUrl}` : mockUrl
      } else {
        return mockUrl
      }
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
    mode: {
      get () {
        return this.$store.state.mode
      },
      set () {
        this.$store.commit('CHANGE_MODE')
      }
    },
    modeName () {
      return this.$store.state.mode === 'edit' ? '编辑' : '测试'
    },
    api () {
      return this.$store.state.api
    },
    creating () {
      return this.$store.state.api._id === undefined
    },
    mockUrl () {
      return this.buildMockUrl()
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
        return this.$store.state.api.options.method
      },
      set (value) {
        this.$store.commit('UPDATE_API_PROPS', ['options.method', value])
      }
    }
  }
}
</script>
<style lang="less">
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
