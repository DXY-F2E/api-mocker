<template>
  <div class="header">
    <el-row type="flex" >
        <el-col :span="0" class="logo"><h1>丁香园 API Mocker</h1></el-col>
        <el-col :span="24">
            <el-menu theme="dark"
                     :default-active="activeIndex"
                     class="el-menu-demo grid-content"
                     mode="horizontal"
                     :router="true"
                     @select="handleSelect">
              <el-menu-item index="/">接口列表</el-menu-item>
              <el-menu-item index="/create">创建接口</el-menu-item>
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
        handleSelect(key, keyPath) {
            window.console.log(key, keyPath);
        }
    }
};
</script>
<style scoped>
.header {
    padding: 0 40px;
    background-color: #324157;
    text-align: left;
}
.el-menu {
    border-radius: 0;
    /*float: right;*/
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
