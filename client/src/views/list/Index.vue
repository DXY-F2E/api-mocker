<template>
  <div class="content">
    <layout>
      <template slot="nav">
        <nav-menu></nav-menu>
      </template>
      <template slot="view">
        <router-view></router-view>
      </template>
    </layout>
  </div>
</template>
<script>
/**
 * 页面：组列表
 * 功能：组列表，添加组，组内接口——添加，导入
 */
import NavMenu from './components/Menu'

export default {
  components: {
    NavMenu
  }
}
</script>
