<template>
  <div id="app">
    <!-- <app-header></app-header> -->
    <router-view></router-view>
  </div>
</template>

<script>
// import AppHeader from './components/common/Header';
export default {
    name: 'API_Mocker',
    components: {
        // AppHeader
    },
    computed: {
        routeName() {
            // window.console.log(this.$route);
            return 'aaa';
            // return this.$route.matched[0].name;
        }
    },
    mounted() {
        this.$store.dispatch('getGroups');
        // window.console.log(this.$route);
        // if (this.routeName !== 'Auth') {
        //     this.$store.dispatch('getGroups');
        // }
    }
};
</script>

<style>
* {
    box-sizing: border-box;
}
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
}
</style>
