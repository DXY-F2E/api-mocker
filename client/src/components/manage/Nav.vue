<template>
<div>
  <el-menu background-color="transparent" :default-active="$route.name" :router="true" class="el-menu-vertical">
    <el-menu-item index="Profile" :route="{name: 'Profile'}">
      <i class="el-icon-minus"></i>个人信息
    </el-menu-item>
    <el-menu-item index="ManageApi" :route="{name: 'ManageApi'}">
      <i class="el-icon-minus"></i>我的API
    </el-menu-item>
    <el-menu-item index="ManageGroup" :route="{name: 'ManageGroup'}">
      <i class="el-icon-minus"></i>我的分组
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
}
</script>
<style lang="less">
.manage-nav {
  .el-menu-item-group__title {
    padding: 15px 20px 0 20px;
    line-height: 30px;
    position: relative;
  }
  .el-menu-item [class^=el-icon-] {
    color: #97a8be;
    margin-left: 20px;
  }
}
</style>
