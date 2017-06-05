<template>
<div>
    <el-menu :default-active="$route.params.groupId" class="el-menu-vertical">
        <el-menu-item-group title="管理设置">
            <el-menu-item index="profile"><i class="el-icon-minus"></i>我的信息</el-menu-item>
            <el-menu-item index="group"><i class="el-icon-minus"></i>我的分组</el-menu-item>
            <el-menu-item index="api"><i class="el-icon-minus"></i>我的<code>API</code></el-menu-item>
        </el-menu-item-group>
    </el-menu>
</div>
</template>

<script>
export default {
};
</script>
<style lang="less">
.manage-nav {
    width: 288px;
    min-width: 288px;
    background-color: #eef1f6;

    .el-menu-item-group__title {
        padding: 15px 20px 0 20px;
        line-height: 30px;
        position: relative;
    }
    .el-menu-item [class^=el-icon-] {
        /*opacity: 0.5;*/
        color: #97a8be;
    }
}
</style>
