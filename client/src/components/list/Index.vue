<template>
 <layout>
   <template slot="nav">
     <nav-menu></nav-menu>
   </template>
   <template slot="view">
     <list-content></list-content>
   </template>
 </layout>
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
