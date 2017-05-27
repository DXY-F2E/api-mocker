<template>
<div>
    <app-header></app-header>
    <router-view></router-view>
</div>
</template>

<script>
import AppHeader from './common/Header';
export default {
    components: {
        AppHeader
    },
    mounted() {
        this.$store.dispatch('getGroups');
    }
};
</script>
<style>
.content {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 0;
}
.list-content {
    min-height: 100%;
}
</style>
