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
              <el-select placeholder="请选择分组" filterable v-model="group">
                <el-option v-for="group in groups"
                           :key="group._id"
                           :label="group.name"
                           :value="group._id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="测试地址">
        <el-input auto-complete="off" v-model="devUrl" placeholder="请填写绝对路径"></el-input>
      </el-form-item>
      <el-form-item label="线上地址">
        <el-input auto-complete="off" v-model="prodUrl" placeholder="请填写绝对路径"></el-input>
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
    <create-group
      :visible="showCreateGroup"
      @action="handleClickCreateGroup"
      @close="handleClickClose"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CreateGroup from '@/components/common/CreateGroup'

export default {
  name: 'ApiInfo',
  components: {
    CreateGroup
  },
  data () {
    return {
      showCreateGroup: false
    }
  },
  computed: {
    ...mapState(['groups']),
    ...mapState('doc', ['api']),
    name: {
      get () {
        document.title = this.api.name || '未命名接口'
        return this.api.name
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['name', value])
      }
    },
    prodUrl: {
      get () {
        return this.api.prodUrl
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['prodUrl', value])
      }
    },
    devUrl: {
      get () {
        return this.api.devUrl
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['devUrl', value])
      }
    },
    proxyMode: {
      get () {
        return this.api.options.proxy.mode
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.proxy.mode', value])
      }
    },
    group: {
      get () {
        return this.api.group
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['group', value])
      }
    }
  },
  methods: {
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
  },
  beforeDestroy () {
    document.title = this.originTitle
  }
}
</script>
<style lang="less">
.api-proxy-tip {
  width: 450px;
}
.api-info {
  padding: 0 20px;

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
