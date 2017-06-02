<template>
  <div class="content">
    <el-row type="flex" class="list-content">
        <api-list :apis="apis"></api-list>
        <router-view :apis="apis" v-if="apis.length"></router-view>
    </el-row>
  </div>
</template>
<script>
import ApiList from './ApiList';
import ApiDoc from './ApiDoc';
import API from '../../store/api';
export default {
    components: {
        ApiList,
        ApiDoc
    },
    data() {
        return {
            api: {},
            apis: []
        };
    },
    methods: {
        getApis(route) {
            if (route.name === 'AllDoc') {
                return;
            }
            const query = {
                page: 1,
                limit: 10000
            };
            this.$http.get(API.GROUP_APIS.replace(':groupId', route.params.groupId), {
                params: query
            }).then(rs => {
                this.apis = rs.data.resources;
            });
        }
    },
    beforeRouteUpdate(to, from, next) {
        this.getApis(to);
        next();
    },
    mounted() {
        this.getApis(this.$route);
    }
};
</script>
<style>
</style>
