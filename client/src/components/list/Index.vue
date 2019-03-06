<template>
 <div class="content">
  <el-row type="flex">
    <nav-menu></nav-menu>
    <el-col class="content-wrap">
      <list-content></list-content>
    </el-col>
  </el-row>
 </div>
</template>
<script>
/**
 * 页面：组列表
 * 功能：组列表，添加组，组内接口——添加，导入
 */
import NavMenu from './Menu'
import ListContent from './Content'
export default {
  components: {
    NavMenu,
    ListContent
  }
}
</script>

<style>
.content-wrap {
  padding: 20px;
  background-color: #F9FAFC;
  min-height: 100%;
  position: relative;
}
</style>
