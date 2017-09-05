<template>
 <div class="content">
  <el-row type="flex" class="list-content">
    <nav-menu></nav-menu>
    <list-content></list-content>
  </el-row>
 </div>
</template>
<script>
import NavMenu from './Menu'
import ListContent from './Content'
export default {
  components: {
    NavMenu,
    ListContent
  }
}
</script>
