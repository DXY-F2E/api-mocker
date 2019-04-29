<template>
<div class="login-box">
  <el-form label-position="left" :model="loginForm" ref="loginForm" :rules="loginRules" @keyup.enter.native="validate">
    <p class="app-name">接口管理系统</p>
    <el-form-item prop="email">
      <el-input placeholder="email" v-model="loginForm.email" ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" placeholder="password" v-model="loginForm.password"></el-input>
    </el-form-item>
    <el-form-item class="control">
      <el-button type="primary" @click="validate">登录</el-button>
      <router-link class="reset-pass" to="find-pass">找回密码</router-link>
      <router-link class="register" to="register">--> 注册</router-link>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      loginRules: {
        email: [{
          type: 'email',
          required: true,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur'
        }]
      },
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('getUser').then((res) => {
      this.$router.push({name: 'List'})
    }).catch((e) => {})
  },
  methods: {
    validate () {
      this.$refs.loginForm.validate(rs => {
        if (rs) {
          this.login()
        }
      })
    },
    login () {
      this.$store.dispatch('login', this.loginForm).then(() => {
        this.$message.success('登录成功, 即将跳转')
        window.setTimeout(() => {
          this.$router.push({
            name: 'GlobalSearch'
          })
        }, 1000)
      }).catch(err => this.$message.error(`登录失败：${err.msg}`))
    }
  }
}
</script>
<style>
</style>
