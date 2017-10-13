<template>
  <div class="url-box">
    <el-row type="flex">
      <el-col :span="24">
        <el-input placeholder="Url保存后自动生成" readonly v-model="url">
          <el-select v-model="method" slot="prepend" placeholder="请选择">
            <el-option label="GET" value="get"></el-option>
            <el-option label="POST" value="post"></el-option>
            <el-option label="PUT" value="put"></el-option>
            <el-option label="PATCH" value="patch"></el-option>
            <el-option label="DELETE" value="delete"></el-option>
          </el-select>
          <copy-button slot="append" :copy-data="url" :disabled="creating">复制</copy-button>
        </el-input>
      </el-col>
      <el-col class="control">
        <el-button id="saveAct" type="info" @click="save()" v-if="mode === 'edit'"></el-button>
        <template v-if="mode === 'test'">
          <el-dropdown split-button
            type="success"
            id="editAct"
            @click="send()"
            @command="updateTestMode"
            v-if="prodUrl || devUrl">
            测试
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="m"
                v-for="(m, idx) in testModes"
                :key="idx"
                v-if="m !== testMode && getTestUrl(m)">
                测试{{m}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button id="editAct" type="success" @click="send()" v-else>测试</el-button>
        </template>
      </el-col>
      <el-col class="mode" v-if="api._id">
        <el-select v-model="mode" placeholder="请选择" >
          <el-option label="编辑模式" value="edit"></el-option>
          <el-option label="测试模式" value="test"></el-option>
          <el-option label="文档模式"
                     value="doc"
                     class="doc"
                     @click.native="showDoc"
                     :disabled="true"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CopyButton from '@/components/common/CopyButton'
export default {
  components: {
    CopyButton
  },
  data () {
    return {
      saveToken: false,
      isShowDialog: false,
      testMode: 'mock',
      testModes: ['mock', 'prod', 'dev']
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
    save () {
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
  .el-col.mode{
    width: 150px;
    text-align: right;
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

  .control{
    width: 134px;
    text-align: right;
  }

  .el-input-group__append {
    padding: 0;
    overflow: hidden;

    & .el-button:last-child {
      border-right: 0;
    }

    & .el-button {
      display: inline-block;
      vertical-align: middle;
      border-right: 1px solid #bfcbd9;
      margin: 0px;
      border-radius: 0;
      width: 70px;
      text-align: center;
    }

    & .el-button.is-disabled {
      border-color: #bfcbd9;
      border-left: none;
      background-color: #eef1f6;
      color: #bfcbd9;
    }

    & .el-button:not(.is-disabled):hover {
      color: #324057;
    }

  }
}

#editAct,
#saveAct {
  width: 91px;
}
#saveAct:after {
  content: '保存';
}
#saveAct:hover:after {
  content: '⌘ + S'
}
.el-select-dropdown__item.is-disabled.doc {
  cursor: pointer;
  color: #48576a;
}
.el-select-dropdown__item.is-disabled.doc:hover {
  /*background-color: #58B7FF;*/
  color: #58B7FF;
}
</style>
