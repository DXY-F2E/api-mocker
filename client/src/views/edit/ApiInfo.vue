<template>
  <div class="api-info el-col" v-side-bar>
    <el-form>
      <el-form-item label="接口名称" class="required">
        <el-input auto-complete="off" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="接口分组" class="required">
        <i class="el-icon-plus title-icon create-group" @click="showCreateGroup = true"></i>
        <div class="group-select">
          <el-row type="flex" >
            <el-col :span="24">
              <el-select placeholder="请选择分组" filterable v-model="group" @change="handleGroupChange">
                <el-option v-for="group in formatedGroups"
                           :key="group._id"
                           :label="group.name"
                           :value="group._id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <div class="divider"></div>
      <el-form-item label="接口路径" :class="$route.name === 'Create' ? 'required' : ''">
        <el-input auto-complete="off" v-model="url" placeholder="请填写接口路径" @input="handleUrlChange"></el-input>
        <div style="color: #5e6d82; font-size: 12px;">注：RESTful路径参数以:开头，如/user/<strong>:id</strong></div>
      </el-form-item>
      <el-form-item style="margin-top: -10px;" label="测试地址">
        <el-input auto-complete="off" v-model="devUrl" placeholder="请填写绝对路径"></el-input>
      </el-form-item>
      <el-form-item label="线上地址">
        <el-input auto-complete="off" v-model="prodUrl" placeholder="请填写绝对路径"></el-input>
      </el-form-item>
      <div class="divider"></div>
      <el-form-item label="接口测试" style="margin: 20px 0 10px;">
        <el-tooltip placement="top" popper-class="api-proxy-tip" content="接口测试时请关闭代理转发"><span class="mocker-tip">?</span></el-tooltip>
        <el-checkbox v-model="interfaceTest" />
        <div class="group-select">
          <el-row type="flex" >
            <el-select v-model="testMode" style="margin-right: 10px;">
              <el-option v-for="(modeItem, index) in testModes" :key="index" :label="modeItem.label" :value="modeItem.mode"></el-option>
            </el-select>
            <el-button type="primary" @click="send">测试</el-button>
          </el-row>
        </div>
      </el-form-item>
            <el-form-item label="代理转发">
        <el-tooltip placement="top" popper-class="api-proxy-tip">
          <span class="mocker-tip">?</span>
          <div slot="content">
            <p>开启后请求mock地址会转发到指定地址，除此外，为便于前端代码控制，也可以在请求Mock URL时，带上query参数来设置：</p>
            <p>转发线上：{ mockURL }?_mockProxyStatus=1</p>
            <p>转发测试：{ mockURL }?_mockProxyStatus=2</p>
          </div>
        </el-tooltip>
        <el-radio-group v-model="proxyMode">
          <el-radio :label="0">不转发</el-radio>
          <el-radio :label="1">转发线上</el-radio>
          <el-radio :label="2">转发测试</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <group-edit
      :visible="showCreateGroup"
      @hide="showCreateGroup = false"
    ></group-edit>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { urlJoin } from '@/util'
import GroupEdit from '@/views/manage/group/GroupEdit'

export default {
  name: 'ApiInfo',
  components: {
    GroupEdit
  },
  data () {
    return {
      localDebugUrl: '',
      showCreateGroup: false,
      interfaceTest: false,
      testMode: 'mock',
      testModes: [{label: 'mock地址', mode: 'mock'}, {label: '测试地址', mode: 'dev'}, {label: '线上地址', mode: 'prod'}]
    }
  },
  watch: {
    interfaceTest (val, oldVal) {
      this.$store.commit('doc/UPDATE_RESPONSE', {})
      this.$store.commit('doc/CHANGE_MODE', val ? 'test' : 'edit')
    }
  },
  computed: {
    ...mapMutations(['SET_GROUP_DETAIL']),
    ...mapState(['groups', 'groupDetail']),
    ...mapState('doc', ['api', 'mode']),
    formatedGroups () {
      return this.groups.map(g => ({
        ...g,
        name: this.getGroupName(g),
        parents: this.getParent(g, this.groups)
      }))
    },
    name: {
      get () {
        document.title = this.api.name || '未命名接口'
        return this.api.name
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['name', value])
        this.$store.commit('doc/SET_API_CHANGED')
      }
    },
    url: {
      get () {
        return this.api.url
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['url', value])
        this.$store.commit('doc/SET_API_CHANGED')
      }
    },
    prodUrl: {
      get () {
        return this.api.prodUrl
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['prodUrl', value])
        // this.$store.commit('doc/SET_API_CHANGED')
      }
    },
    devUrl: {
      get () {
        return this.api.devUrl
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['devUrl', value])
        // this.$store.commit('doc/SET_API_CHANGED')
      }
    },
    proxyMode: {
      get () {
        return this.api.options.proxy.mode
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.proxy.mode', value])
        this.$store.commit('doc/SET_API_CHANGED')
      }
    },
    group: {
      get () {
        return this.api.group
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['group', value])
        this.$store.commit('doc/SET_API_CHANGED')
      }
    }
  },
  methods: {
    ...mapActions(['testApi', 'getGroup', 'localDebugApi']),
    getParent (g, groups) {
      let res = []
      if (g.pGroup) {
        const parent = groups.find(group => group._id === g.pGroup)
        if (parent) res.push(parent)
        if (parent && parent.pGroup) res = [...this.getParent(parent, groups), ...res]
      }
      return res
    },
    getGroupName (group) {
      group.parents = this.getParent(group, this.groups)
      const { parents, name } = group
      if (!parents || parents.length === 0) return name
      return parents.map(g => g.name).join(' / ') + ' / ' + name
    },
    handleGroupChange (e) {
      this.getGroup(e).then(() => {
        this.setApiUrl()
      })
    },
    handleUrlChange () {
      this.setApiUrl()
    },
    setApiUrl () {
      if (this.url && this.groupDetail) {
        if (this.groupDetail.devPrefix) {
          this.devUrl = urlJoin(this.groupDetail.devPrefix, this.url)
        }
        if (this.groupDetail.prodPrefix) {
          this.prodUrl = urlJoin(this.groupDetail.prodPrefix, this.url)
        }
      }
      if (!this.url && this.groupDetail) {
        if (this.groupDetail.devPrefix) this.devUrl = ''
        if (this.groupDetail.prodPrefix) this.prodUrl = ''
      }
    },
    validateProxyUrl (url) {
      if (/(127.0.0.1)|(0.0.0.0)|(localhost)/.test(url)) return false
      return true
    },
    send () {
      if (this.mode !== 'test') {
        return this.$message({type: 'error', message: '请先勾选接口测试'})
      }
      this.$store.commit('doc/UPDATE_RESPONSE', {})
      this.testApi(this.testMode)
    },
    handleClickCreateGroup (groupName) {
      this.$store.dispatch('createGroup', { name: groupName }).then(() => {
        this.showCreateGroup = false
      }).catch(e => this.$message.error(e.msg))
    },
    handleClickClose () {
      this.showCreateGroup = false
    }
  },
  created () {
    this.originTitle = document.title
    const groupId = this.$route.query.groupId || this.$route.params.groupId
    if (groupId) {
      this.getGroup(groupId).then(() => {
        this.setApiUrl()
      })
    }
  },
  beforeDestroy () {
    document.title = this.originTitle
    // this.SET_GROUP_DETAIL({})
  }
}
</script>
<style lang="less">
.api-proxy-tip {
  width: 450px;
}
.api-info {
  padding: 0 20px;

  .divider {
    height: 1px;
    background-color: #ddd;
  }

  .el-textarea__inner,
  .el-input__inner {
    background-color: #F9FAFC;
  }
  // 防止创建分组的输入框背景色被覆盖
  .create-group-dialog .el-input__inner {
    background-color: #fff;
  }
  .el-form {
    min-height: 100%;
  }

  .create-group {
    color: #97a8be;
    cursor: pointer;
  }

  .el-radio-group {
    display: block;
    margin-top: 5px;
    .el-radio {
      /*margin-left: 15px;*/
      display: block;
      margin: 5px 0;
      color: #475669;
      font-family: monospace;

      &__label {
        margin-left: 5px;
      }
    }
  }
}

.group-select {
  display: inline-block;
  width: 100%;
  .el-icon-plus {
    width: 50px;
    line-height: 36px;
  }

  .el-select .el-input__inner,
  .el-select {
    width: 100%;
  }
}

.issue {
  text-align: center;
  margin-top: -30px;
  a {
    color: #99A9BF;
    font-size: 12px;
    margin: 0 35px;
  }
}

.el-form-item.required .el-form-item__label:after {
  content: '*';
  color: #ff4949;
  margin-left: 2px;
}

</style>
