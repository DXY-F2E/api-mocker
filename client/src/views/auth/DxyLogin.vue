<template>
<div class="login-box">
  <el-form label-position="left">
    <p class="app-name">接口管理系统登录中...</p>
  </el-form>
</div>
</template>

<script>
// 此文件与其功能仅为丁香园内部授权登录有关，非丁香园人员不用关心
export default {
  methods: {
    dxyLogin (ticket) {
      this.$store.dispatch('dxyLogin', ticket).then(rs => {
        console.log(rs.data.message)
        this.$message.success('登录成功, 即将跳转')
        window.setTimeout(() => {
          this.$router.push({
            name: 'GlobalSearch'
          })
        }, 1000)
      }).catch(err => {
        this.$message.error(`登录失败：${err.msg}，请输入账号登录`)
        window.setTimeout(() => {
          this.$router.push('login')
        }, 1000)
      })
    }
  },
  mounted () {
    this.$store.dispatch('getUser').then((res) => {
      this.$router.push({name: 'List'})
    }).catch((e) => {})
  },
  created () {
    const { ticket } = this.$route.query
    if (ticket) {
      this.dxyLogin(ticket)
    } else {
      this.$router.push('login')
    }
  }
}
</script>
<style>
</style>
