<template>
  <div v-if="user">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import AppHeader from './common/Header'
export default {
  components: {
    AppHeader
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    windowWidth: {
      get () {
        return this.$store.state.windowWidth
      },
      set (value) {
        this.$store.commit('UPDATE_WINDOW_WIDTH', value)
      }
    }
  },
  methods: {
    windowResize () {
      this.windowWidth = document.body.clientWidth
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.windowResize)
  },
  mounted () {
    this.windowWidth = document.body.clientWidth
    // 暂时无用
    // window.addEventListener('resize', this.windowResize);
    this.$store.dispatch('getUser').then(() => {
      this.$store.dispatch('getGroups')
    }).catch(() => {
      window.location.href = '#/login'
    })
  }
}
</script>
<style lang="less">
.content {
  position: absolute;
  width: 100%;
  right: 0;
  left: 0;
  top: 60px;
  bottom: 0;
  text-align: left;
  & > .el-row {
    height: 100%;
    position: relative;
  }
  & > .el-row > .el-col {
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .list-content {
    min-height: 100%;
  }
}
</style>
