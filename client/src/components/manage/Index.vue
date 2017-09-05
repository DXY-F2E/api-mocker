<template>
  <div class="content" id="manage">
    <el-row type="flex">
      <el-col :span="0" class="manage-nav">
        <manage-nav></manage-nav>
      </el-col>
      <el-col :span="24" class="manage-content">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ManageNav from './Nav'
export default {
  components: {
    ManageNav
  },
  mounted () {
    this.$store.dispatch('getAllUsers')
  }
}
</script>
<style>
.manage-content {
  background-color: #F9FAFC;
  padding: 20px;
}
</style>
