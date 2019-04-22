<template>
  <layout>
    <template slot="nav">
      <manage-nav></manage-nav>
    </template>
    <template slot="view">
      <router-view></router-view>
    </template>
  </layout>
</template>

<script>
import ManageNav from './Nav'
export default {
  components: {
    ManageNav
  },
  mounted () {
    this.$store.dispatch('getAllUsers')
  }
}
</script>
