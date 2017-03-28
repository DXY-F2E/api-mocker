<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import AppHeader from './components/common/Header';
export default {
    name: 'app',
    components: {
        AppHeader
    },
    methods: {
        getGroups() {
            this.$store.dispatch('GET_GROUPS');
        }
    },
    mounted() {
        this.getGroups();
    }
};
</script>

<style>
* {
    box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
