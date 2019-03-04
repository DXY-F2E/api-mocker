<template>
 <div class="content">
  <el-row type="flex" class="list-content">
    <nav-menu></nav-menu>
    <list-content></list-content>
  </el-row>
 </div>
</template>
<script>
/** 组列表
 * 组列表
 * 添加组
 * 组内接口——添加，导入
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
