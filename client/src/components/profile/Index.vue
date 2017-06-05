<template>
<div class="profile-box">
    <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="姓名">
            {{user.name}}
        </el-form-item>
        <el-form-item label="邮箱">
            {{user.email}}
        </el-form-item>
        <el-form-item label="团队">
            丁香园
        </el-form-item>
    </el-form>
</div>
</template>

<script>
export default {
    computed: {
        user() {
            return this.$store.state.user;
        }
    }
};
</script>
<style lang="less">
.profile-box {
    padding: 20px;
    .el-form-item {
        border-bottom: 1px solid #ebeef5;
    }
}
</style>
