<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'API_Mocker'
}
</script>

<style>
* {
    box-sizing: border-box;
}
#app {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    min-width: 1000px;
}
</style>
