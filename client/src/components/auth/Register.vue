<template>
<div class="login-box">
  <el-form label-position="left" :model="registerForm" :rules="registerRules" ref="registerForm">
    <p class="app-name">账号注册</p>
    <el-form-item prop="email">
      <el-input placeholder="email" v-model="registerForm.email" ></el-input>
    </el-form-item>
    <el-form-item prop="name">
      <el-input placeholder="name" v-model="registerForm.name" ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" placeholder="password" v-model="registerForm.password"></el-input>
    </el-form-item>
    <el-form-item prop="verifyPassword">
      <el-input type="password" placeholder="verify password" v-model="registerForm.verifyPassword"></el-input>
    </el-form-item>
    <el-form-item class="control">
      <el-button type="primary" @click="validate">注册</el-button>
      <router-link class="login" to="login">--> 登录</router-link>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      registerRules: {
        email: [{
          type: 'email',
          required: true,
          trigger: 'blur'
        }],
        name: [{
          required: true,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur'
        }],
        verifyPassword: [{
          validator: this.validateVerifyPass,
          trigger: 'blur'
        }]
      },
      registerForm: {
        email: '',
        name: '',
        password: '',
        verifyPassword: ''
      }
    }
  },
  methods: {
    validateVerifyPass (rule, value, callback) {
      if (value === '') {
        callback(new Error('verify password is required'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('verify password don\'t match'))
      } else {
        callback()
      }
    },
    validate () {
      this.$refs.registerForm.validate(rs => {
        if (rs) {
          this.register()
        }
      })
    },
    register () {
      this.$store.dispatch('register', this.registerForm).then(() => {
        this.$message.success('注册成功, 即将跳转')
        window.setTimeout(() => {
          this.$router.push({
            name: 'AllList'
          })
        }, 1000)
      }).catch(err => this.$message.error(`注册失败：${err.msg}`))
    }
  }
}
</script>
<style>
</style>
