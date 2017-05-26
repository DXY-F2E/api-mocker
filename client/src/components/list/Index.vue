<template>
  <div class="content">
    <el-row type="flex" class="list-content">
        <nav-menu></nav-menu>
        <router-view></router-view>
    </el-row>
  </div>
</template>
<script>
import NavMenu from './Menu';
export default {
    components: {
        NavMenu
    }
};
</script>
