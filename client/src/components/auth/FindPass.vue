<template>
  <div class="login-box reset-password">
    <el-form label-position="left" :model="findForm" :rules="resetRules" ref="findForm" v-stop-default-enter>
      <p class="app-name">找回密码</p>
      <el-form-item prop="email">
        <el-input placeholder="email" v-model="findForm.email"></el-input>
      </el-form-item>
      <el-form-item class="control">
        <el-button type="primary" @click="validate">发送邮件</el-button>
        <router-link class="login" to="login">--> 登录</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      resetRules: {
        email: [{
          type: 'email',
          required: true,
          trigger: 'blur'
        }]
      },
      findForm: {
        email: ''
      }
    }
  },
  methods: {
    ...mapActions(['sendResetPassTicket']),
    validate () {
      if (this.sentCodeToken) {
        return
      }
      this.$refs.findForm.validateField('email', rs => {
        if (rs) {
          this.$message.error('请填写正确的邮箱地址')
          return
        }
        this.sentCodeToken = true
        this.sendResetPassTicket(this.findForm.email).then(() => {
          this.$message.info('发送验证码成功，请注意查收邮件')
          this.sentCodeToken = false
        }).catch(err => {
          this.$message.error(`发送失败：${err.msg}`)
          this.sentCodeToken = false
        })
      })
    }
  }
}
</script>
<style>
</style>
