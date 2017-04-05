<template>
    <div class="api-list-box">
        <ul class="api-list" v-loading="apiListLoading">
            <li v-for="(api, idx) in apiList">
                <api :data="api" :index="idx"></api>
            </li>
            <li class="empty">暂无接口</li>
        </ul>
    </div>
</template>

<script>
import Api from './Api';
import { mapState } from 'vuex';

export default {
    components: {
        Api
    },
    computed: mapState(['apiList', 'apiListLoading'])
};
</script>
<style>
</style>
