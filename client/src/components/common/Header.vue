<template>
  <div class="header">
    <el-row type="flex" >
        <el-col :span="0" class="logo"><h1>DXY API Mocker</h1></el-col>
        <el-col :span="24">
            <el-menu theme="dark"
                     :default-active="$route.name"
                     class="el-menu-demo grid-content"
                     mode="horizontal"
                     :router="true"
                     >
              <el-menu-item index="AllList" :route="{name: 'AllList'}">接口列表</el-menu-item>
              <el-menu-item index="Create" :route="{name: 'Create'}" @click.native="createApi()">创建接口</el-menu-item>
              <el-menu-item index="Document" v-show="$route.name === 'Document'">接口文档</el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '/'
        };
    },
    methods: {
        createApi() {
            this.$store.commit('INIT_API');
            this.$store.commit('CHANGE_MODE', 'edit');
        }
    }
};
</script>
<style scoped>
.header {
    padding: 0 40px;
    background-color: #324157;
    text-align: left;
    min-width: 550px;
}
.el-menu {
    border-radius: 0;
    /*float: right;*/
}
.el-menu-item.is-active {
    border-bottom: 5px solid #20a0ff;
}
.el-menu--horizontal .el-menu-item {
  margin-right: 20px;
}
.logo {
    width: 200px;
    min-width: 200px;
}
h1 {
    line-height: 60px;
    color: #fff;
}
</style>
