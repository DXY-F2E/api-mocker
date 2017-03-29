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
    },
    mounted() {
        this.$store.dispatch('getApiList');
    }
};
</script>
<style>
.content {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 0;
}
.list-content {
    min-height: 100%;
}
</style>
