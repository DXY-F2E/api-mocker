<template>
<div>
  <el-menu :default-active="$route.name" :router="true" class="el-menu-vertical">
    <el-menu-item-group title="管理设置">
      <el-menu-item index="ManageApi" :route="{name: 'ManageApi'}">
        <i class="el-icon-minus"></i>管理<code>API</code>
      </el-menu-item>
      <el-menu-item index="ManageGroup" :route="{name: 'ManageGroup'}">
        <i class="el-icon-minus"></i>管理分组
      </el-menu-item>
      <el-menu-item index="Profile" :route="{name: 'Profile'}">
        <i class="el-icon-minus"></i>个人信息
      </el-menu-item>
    </el-menu-item-group>
  </el-menu>
</div>
</template>

<script>
export default {
}
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
    color: #97a8be;
    margin-left: 20px;
  }
}
</style>
