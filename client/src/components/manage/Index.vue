<template>
  <div class="content" id="manage">
    <el-row type="flex">
        <el-col :span="0" class="manage-nav">
            <manage-nav></manage-nav>
        </el-col>
        <el-col :span="24">
            <router-view></router-view>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import ManageNav from './Nav';
export default {
    components: {
        ManageNav
    }
};
</script>
<style>
</style>
