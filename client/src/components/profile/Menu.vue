<template>
<div class="profile-menu" v-if="user">
    <div class="name"><span>{{user.name}}</span> <i class="el-icon-caret-bottom"></i></div>
    <div class="profile-nav">
        <router-link :to="manageRoute">权限管理</router-link>
        <a href="javascript:;" @click="logout">注销登录</a>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            manageRoute: {
                name: 'ManageApi'
            }
        };
    },
    methods: {
        logout() {
            this.$store.dispatch('logout').then(rs => {
                if (rs.data.success) {
                    this.$router.push({
                        name: 'Login'
                    });
                } else {
                    this.$message.error(`注销失败：${rs.data.msg}`);
                }
            }).catch(err => {
                if (err.response) {
                    this.$message.error(`注销失败：${err.response.data.message}`);
                } else {
                    this.$message.error(`注销失败：${err}`);
                }
            });
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    }
};
</script>
<style scoped>
.profile-menu {
    width: 120px;
    text-align: right;
    position: relative;
    cursor: pointer;
}
.profile-menu:hover {
    background-color: #3d4c63;
}
.name {
    color: #fff;
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 60px;
    vertical-align: top;
}
.name span {
    display: inline-block;
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
}
.name i {
    color: #fff;
    margin-left: 5px;
    font-size: 12px;
    vertical-align: middle;
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
}
.profile-menu:hover .profile-nav {
    display: inline-block;
}
.profile-nav a:hover {
    background-color: #3d4c63;
}
.profile-nav a {
    display: block;
    width: 100%;
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
    color: #fff;
}
</style>
