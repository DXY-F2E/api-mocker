<template>
  <div class="login-box reset-password">
    <el-form label-position="left" :model="resetForm" :rules="resetRules" ref="resetForm">
      <p class="app-name">密码重置</p>
      <el-form-item prop="email">
        <el-input placeholder="email" v-model="resetForm.email"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="verifyCode">
       <el-row type="flex">
         <el-input span="24" placeholder="code" v-model="resetForm.verifyCode" ></el-input>
         <el-button size="small" class="sent-code" @click="sentCode">{{codeText}}</el-button>
       </el-row>
      </el-form-item> -->
      <el-form-item prop="password">
        <el-input type="password" placeholder="password" v-model="resetForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="verifyPassword">
        <el-input type="password" placeholder="verify password" v-model="resetForm.verifyPassword"></el-input>
      </el-form-item>
      <el-form-item class="control">
        <el-button type="primary" @click="validate">确定</el-button>
        <router-link class="login" to="login">--> 登录</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  computed: {
    codeText () {
      if (this.sentCodeToken) {
        return `${this.interval}s`
      } else {
        return '发送验证码'
      }
    }
  },
  data () {
    return {
      interval: 60,
      sentCodeToken: false,
      resetRules: {
        email: [{
          type: 'email',
          required: true,
          trigger: 'blur'
        }],
        // verifyCode: [{
        //     required: true,
        //     trigger: 'blur'
        // }],
        password: [{
          required: true,
          trigger: 'blur'
        }],
        verifyPassword: [{
          validator: this.validateVerifyPass,
          trigger: 'blur'
        }]
      },
      resetForm: {
        ticket: this.$route.query.ticket,
        email: '',
        // verifyCode: '',
        password: '',
        verifyPassword: ''
      }
    }
  },
  methods: {
    ...mapActions(['sendResetPassCode', 'resetPass']),
    validateVerifyPass (rule, value, callback) {
      if (value === '') {
        callback(new Error('verify password is required'))
      } else if (value !== this.resetForm.password) {
        callback(new Error('verify password don\'t match'))
      } else {
        callback()
      }
    },
    validate () {
      this.$refs.resetForm.validate(rs => {
        if (rs) {
          this.resetPassword()
        }
      })
    },
    resetPassword () {
      window.console.log(this.resetForm)
      this.resetPass(this.resetForm).then(() => {
        this.$message.success('密码修改成功, 请登录')
        window.setTimeout(() => {
          this.$router.push({
            name: 'Login'
          })
        }, 1000)
      }).catch(err => this.$message.error(`修改失败：${err.msg}`))
    },
    countDown () {
      this.sentCodeToken = true
      const inter = window.setInterval(() => {
        this.interval--
        if (this.interval === 0) {
          window.clearInterval(inter)
          this.sentCodeToken = false
          this.interval = 60
        }
      }, 1000)
    },
    sentCode () {
      if (this.sentCodeToken) {
        this.$message.error('请勿重复发送')
        return
      }
      this.$refs.resetForm.validateField('email', rs => {
        if (rs) {
          this.$message.error('请填写正确的邮箱地址')
          return
        }
        this.sendResetPassCode(this.resetForm.email).then(() => {
          this.$message.info('发送验证码成功，请注意查收邮件')
          this.countDown()
        }).catch(err => this.$message.error(`发送失败：${err.msg}`))
      })
    }
  }
}
</script>
<style>
</style>
