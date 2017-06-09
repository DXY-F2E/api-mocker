<template>
    <div class="auth-page">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
};
</script>
<style>
.auth-page {
    /* 灰白色 */
    /*background-color: #eef1f6;*/
    /* 深紫色，跟admin header颜色一致 */
    /*background-color: #324157;*/
    /* 蓝色 */
    /*background-color: rgb(43, 94, 125);*/
    /* 黛蓝 */
    background-color: rgb(48, 71, 88);
    background-image: url(../../assets/texture.png);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.login-box {
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.login-box .el-form {
    background-color: #fff;
    /*box-shadow: 0 0 15px 1px #ddd;*/
    border-radius: 3px;
    padding: 20px 30px;
}
.login-box .control {
    text-align: center;
}
.login-box .control button{
    width: 100%;
}
.login-box .control a {
    color: #ccc;
    position: absolute;
    right: 0;
    top: 100%;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
}
.login-box .app-name {
    text-align: center;
    font-size: 18px;
    margin-bottom: 20px;
    color: #475669;
    position: relative;
}
</style>
