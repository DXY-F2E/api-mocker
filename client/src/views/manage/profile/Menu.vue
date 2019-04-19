<template>
<div class="profile-menu" v-if="user">
  <div class="name"><span>{{user.name}}</span> <i class="el-icon-caret-bottom"></i></div>
  <div class="profile-nav">
    <router-link :to="profileRoute">个人信息</router-link>
    <router-link :to="manageRoute">接口管理</router-link>
    <a href="javascript:;" @click="logout">注销登录</a>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      manageRoute: {
        name: 'ManageApi'
      },
      profileRoute: {
        name: 'Profile'
      }
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          name: 'Login'
        })
      }).catch(err => this.$message.error(`注销失败：${err.msg}`))
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>
<style lang="less" scoped>
.profile-menu {
  display: inline-block;
  width: 120px;
  text-align: right;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: #3d4c63;

    .profile-nav {
      display: inline-block;
    }
  }
}

.name {
  color: #fff;
  display: inline-block;
  width: 100%;
  text-align: center;
  line-height: 60px;
  vertical-align: top;

  span {
    display: inline-block;
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }
  i {
    color: #fff;
    margin-left: 5px;
    font-size: 12px;
    vertical-align: middle;
  }
}
.profile-nav {
  display: none;
  position: absolute;
  z-index: 2;
  border-top: 1px solid #324157;
  background-color: #324157;
  top: 100%;
  left: 0;
  right: 0;
  color: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  margin-top: -1px;

  a {
    display: block;
    width: 100%;
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
    color: #fff;

    &:hover {
      background-color: #3d4c63;
    }
  }
}
</style>
