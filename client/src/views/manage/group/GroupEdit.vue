<template>
<el-dialog :title="title" :visible="visible" @open="initLocalGroup" @close="handleClose" :show-close="false" width="800px">
  <el-form v-stop-default-enter label-position="right" label-width="134px">
    <el-form-item label="分组名称：" required>
      <el-input v-model="localGroup.name"></el-input>
    </el-form-item>
    <el-form-item label="测试地址前缀：">
      <el-tooltip placement="top">
        <span class="mocker-tip tip-icon">?</span>
        <div slot="content">请填写接口组对应的测试环境统一接口前缀，一般是该环境对应的host；<br>
        如http://dev.dxy.com，接口路径为/api/login，则该接口测试环境地址为 <span style="color: red;">http://dev.dxy.com</span>/api/login</div>
      </el-tooltip>
      <el-input v-model="localGroup.devPrefix" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="线上地址前缀：">
      <el-tooltip placement="top">
        <span class="mocker-tip tip-icon">?</span>
        <div slot="content">请填写接口组对应的线上环境统一接口前缀，一般是该环境对应的host；<br>
          如http://prod.dxy.com，接口路径为/api/login，则该接口线上环境地址为 <span style="color: red;">http://prod.dxy.com</span>/api/login</div>
      </el-tooltip>
      <el-input v-model="localGroup.prodPrefix" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="隐私性：">
      <el-radio-group v-model="localGroup.privacy">
        <el-radio :label="0">所有人可见</el-radio>
        <el-radio :label="1">组内成员可见</el-radio>
        <el-radio :label="3">自己可见</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="接口操作：">
      <el-radio-group v-model="localGroup.operation">
        <el-radio :label="0">所有人可操作</el-radio>
        <el-radio :label="1">组内成员可操作</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="组内成员：">
      <user-selector
        class="group-member"
        :value="localGroup.member"
        :remoteMethod="searchUsers"
        :options="users"
        @itemRemove="itemRemove"
        @itemClick="itemClick">
      </user-selector>
    </el-form-item>
    <el-form-item label="管理员：">
      <search-user v-model="manageName" placeholder="搜索用户" @select="manageChange"></search-user>
    </el-form-item>
    <el-form-item v-if="localGroup._id" label="token：">
      <div class="token-wrapper">
        <el-input ref="token" v-model="localGroup.token" :readonly="true" placeholder="如果为空请点击刷新按钮" />
        <el-tooltip class="item" effect="dark" content="复制" placement="top">
          <i class="icon el-icon-document" @click="handleCopy"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新key之后，之前的key将无法使用!" placement="top">
            <i class="icon el-icon-refresh" @click="refreshToken"></i>
        </el-tooltip>
      </div>
      <div class="tip">每个项目都有唯一的标识token，用户可以使用这个token值进行自动导入</div>
      <div class="tip">为确保项目内数据的安全性和私密性，请勿轻易暴露该token。</div>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import UserSelector from '@/components/common/UserSelector'
import { mapState } from 'vuex'
import SearchUser from '@/components/common/SearchUser'
import R from 'ramda'
import sha from 'sha.js'
export default {
  components: {
    UserSelector,
    SearchUser
  },
  props: {
    group: {
      type: Object,
      default: () => ({})
    },
    pGroup: {
      type: Object,
      default: () => ({})
    },
    visible: Boolean
  },
  data () {
    const defaultGroup = { token: '' }
    return {
      localGroup: Object.assign({}, defaultGroup, this.group),
      users: [],
      manageName: ''
    }
  },
  mounted () {
    this.initManageName()
    this.initUsers()
  },
  computed: {
    ...mapState(['serverRoot']),
    allUsers () {
      return this.$store.state.allUsers
    },
    title () {
      if (this.pGroup._id) {
        // 子组
        return `${'添加子分组' + (this.localGroup.name || '')}${this.pGroup._id ? '到' + this.pGroup.name : ''}`
      } else {
        if (this.localGroup._id) {
          // 编辑
          return `编辑分组${this.localGroup.name || ''}`
        } else {
          // 添加
          return `添加分组${this.localGroup.name || ''}`
        }
      }
    }
  },
  watch: {
    'localGroup': 'initManageName'
  },
  methods: {
    handleClose () {
      this.localGroup = {}
      this.users = []
      this.manageName = ''
    },
    refreshToken () {
      let passsalt = this.localGroup._id + '-' + new Date().getTime()
      let token = sha('sha1').update(passsalt).digest('hex')
      this.localGroup.token = token
    },
    initManageName () {
      const user = this.allUsers.find(i => i._id === this.localGroup.manager) || { name: '' }
      this.manageName = user ? user.name : ''
    },
    initUsers () {
      this.users = this.localGroup.member ? (this.localGroup.member.map(id =>
        this.allUsers.find(u => u._id === id)
      )) : []
    },
    searchUsers (val) {
      this.users = this.allUsers.filter(u =>
        u.email.indexOf(val) >= 0 || u.name.indexOf(val) >= 0
      )
    },
    itemClick (val) {
      this.localGroup.member = R.symmetricDifference(this.localGroup.member, [val])
    },
    itemRemove (val) {
      this.localGroup.member = R.without([val], this.localGroup.member)
    },
    initLocalGroup () {
      const defaultGroup = { token: '' }
      this.localGroup = Object.assign({}, defaultGroup, this.group)
      this.initUsers()
    },
    cancel () {
      this.$emit('hide')
    },
    confirm () {
      if (this.pGroup._id) this.localGroup.pGroup = this.pGroup._id
      if (!this.localGroup._id) {
        // 新增组
        this.$store.dispatch('createGroup', this.localGroup).then(rs => {
          this.$message({type: 'success', message: '新增成功'})
          this.$emit('addSuccess', rs.data)
          this.$emit('hide')
        }).catch(err => this.$message({type: 'error', message: err.msg}))
        return
      }
      this.$store.dispatch('updateGroup', this.localGroup).then(rs => {
        this.$message.success({type: 'success', message: '更新成功'})
        this.$emit('update', rs.data)
        this.$emit('hide')
      }).catch(err => this.$message({type: 'error', message: err.msg}))
    },
    manageChange (item) {
      this.localGroup.manager = item.id
    },
    handleCopy () {
      if (this.localGroup.token) {
        this.$refs.token.select()
        document.execCommand('copy')
        this.$message({ type: 'success', message: '复制成功', duration: 1000 })
      } else {
        this.$message.error('请点击刷新按钮，生成分组token')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tip-icon {
  position: absolute;
  margin-left: -130px;
  margin-top: 10px;
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
  background: #97a8be;
  color: #fff;
}
.token-wrapper {
  display: flex;
  align-items: center;
  padding-right: 16px;
  .icon {
    font-size: 20px;
    margin-left: 8px;
    cursor: pointer;
  }
}
.tip {
  font-size: 12px;
  margin-top: 12px;
  line-height: 1;
}
</style>
