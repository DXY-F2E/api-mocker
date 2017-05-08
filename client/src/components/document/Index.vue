<template>
  <div class="content">
    <el-row type="flex" class="list-content">
        <template v-if="api._id">
            <api-list :apis="apis" :groups="groups" @change="getApi"></api-list>
            <api-doc :api="api"></api-doc>
        </template>
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
    computed: {
        groups() {
            return this.$store.state.groups;
        }
    },
    methods: {
        initDoc() {
            this.getApis();
        },
        getApis() {
            const query = {
                page: 1,
                size: 10000
            };
            this.$http.get(API.GROUP_APIS.replace(':groupId', this.$route.params.groupId), {
                params: query
            }).then(rs => {
                this.apis = rs.data.resources;
                this.getApi();
            });
        },
        getApi() {
            this.api = this.apis.find(api => api._id === this.$route.params.apiId);
        }
    },
    mounted() {
        this.initDoc();
    }
};
</script>
<style>
</style>
