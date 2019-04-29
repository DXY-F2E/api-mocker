<template>
<div>
  <el-menu background-color="transparent" :default-active="$route.name" :router="true" class="el-menu-vertical">
    <el-menu-item index="Profile" :route="{name: 'Profile'}">
      <i class="el-icon-caret-right"></i>
      <span slot="title">个人信息</span>
    </el-menu-item>
    <el-menu-item index="ManageApi" :route="{name: 'ManageApi'}">
      <i class="el-icon-caret-right"></i>
      <span slot="title">我的API</span>
    </el-menu-item>
    <el-menu-item index="ManageGroup" :route="{name: 'ManageGroup'}">
      <i class="el-icon-caret-right"></i>
      <span slot="title">我的分组</span>
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
}
</script>
