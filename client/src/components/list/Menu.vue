<template>
    <el-col :span="0" class="menu-nav">
        <el-menu default-active="group" class="el-menu-vertical">
            <el-menu-item-group title="Group">
                <el-menu-item index="1"><i class="el-icon-minus"></i>技术产品部</el-menu-item>
                <el-menu-item index="2"><i class="el-icon-minus"></i>前端组</el-menu-item>
                <el-menu-item index="3"><i class="el-icon-minus"></i>NativeApp组</el-menu-item>
                <el-menu-item index="4"><i class="el-icon-minus"></i>Java团队</el-menu-item>
                <el-menu-item index="5"><i class="el-icon-minus"></i>PHP团队</el-menu-item>
                <el-menu-item index="6"><i class="el-icon-minus"></i>SNS JAVA团队</el-menu-item>
            </el-menu-item-group>
        </el-menu>
    </el-col>
</template>
<script>
export default {
};
</script>
<style>
.menu-nav {
    width: 225px;
    min-width: 225px;
    background-color: #eef1f6;
}
.el-menu-item-group > ul li i {
    visibility: hidden;
}
</style>
