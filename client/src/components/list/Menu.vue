<template>
    <el-col :span="0" class="menu-nav">
        <el-menu default-active="group" class="el-menu-vertical">
            <el-menu-item-group title="Group">
                <el-menu-item v-for="group in groups" :key="group._id" :index="group._id" >
                    <i class="el-icon-minus"></i>{{group.name}}
                </el-menu-item>
            </el-menu-item-group>
        </el-menu>
    </el-col>
</template>
<script>
export default {
    computed: {
        groups() {
            return this.$store.state.groups;
        }
    }
};
</script>
<style>
.menu-nav {
    width: 288px;
    min-width: 288px;
    background-color: #eef1f6;
}
.el-menu-item-group > ul li i {
    visibility: hidden;
}
</style>
