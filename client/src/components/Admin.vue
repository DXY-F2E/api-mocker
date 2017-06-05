<template>
<div v-if="user">
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
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        this.$store.dispatch('getUser').then(() => {
            this.$store.dispatch('getGroups');
        });
    }
};
</script>
<style>
.content {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 0;
    text-align: left;
}
.content > .el-row{
    height: 100%;
    position: relative;
}
.content > .el-row > .el-col {
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
}
.list-content {
    min-height: 100%;
}
</style>
