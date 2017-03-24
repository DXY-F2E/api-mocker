<template>
  <div class="content">
    <el-row type="flex" class="list-content">
        <nav-menu></nav-menu>
        <main-content></main-content>
    </el-row>
  </div>
</template>

<script>
import NavMenu from './Menu';
import MainContent from './Content';
export default {
    components: {
        NavMenu,
        MainContent
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
