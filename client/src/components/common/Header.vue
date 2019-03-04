<template>
  <div class="header">
    <el-row type="flex">
      <el-col :span="3" class="logo">{{appName}}</el-col>
      <el-col :span="19">
        <el-menu
          :default-active="activeIndex"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="el-menu-demo grid-content"
          mode="horizontal"
          :router="true"
        >
          <!-- <el-menu-item index="Search" :route="{name: 'Search'}">统一搜索</el-menu-item> -->
          <el-menu-item index="List" :route="{name: 'AllList'}">接口列表</el-menu-item>
          <el-menu-item index="Create" :route="{name: 'Create'}">创建接口</el-menu-item>
          <!-- <el-menu-item index="Document" :route="{name: 'Document'}">接口文档</el-menu-item> -->
          <!-- <el-menu-item index="Stat" :route="{name: 'Stat'}">数据统计</el-menu-item> -->
          <!-- 文档是外链，不用触发系统自身路由 -->
          <el-menu-item @click="showDocs">使用教程</el-menu-item>
          <el-menu-item @click="showChangeLog = true">更新说明</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="2">
        <profile-menu></profile-menu>
      </el-col>
    </el-row>
    <change-log :visible.sync="showChangeLog"></change-log>
  </div>
</template>

<script>
import ProfileMenu from '../profile/Menu'
import config from '../../../config'
import ChangeLog from '@/components/log/ChangeLog'
export default {
  components: {
    ProfileMenu,
    ChangeLog
  },
  data () {
    return {
      appName: config.appName,
      showChangeLog: false
    }
  },
  methods: {
    showDocs () {
      window.open(config.docsUrl)
    }
  },
  computed: {
    activeIndex () {
      return this.$route.matched[1] ? this.$route.matched[1].name : ''
    }
  }
}
</script>
<style scoped>
.header {
  padding: 0 20px;
  background-color: #545c64;
  text-align: left;
}
.el-menu {
  border-radius: 0;
  /*float: right;*/
}
.el-menu-item.is-active {
  border-bottom: 5px solid #20a0ff;
}
.el-menu--horizontal .el-menu-item {
  margin-right: 20px;
}
.logo {
  line-height: 60px;
  color: #fff;
  font-size: 22px;
}
</style>
