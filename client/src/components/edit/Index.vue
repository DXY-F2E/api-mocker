<template>
  <div class="content" :class="mode">
    <el-row type="flex" class="list-content" v-if="!loading">
        <api-info></api-info>
        <api-box></api-box>
    </el-row>
  </div>
</template>

<script>
import ApiInfo from './ApiInfo';
import ApiBox from './ApiBox';
import { mapActions, mapState } from 'vuex';
export default {
    components: {
        ApiInfo,
        ApiBox
    },
    data() {
        return {
            loading: true
        };
    },
    methods: {
        ...mapActions([
            'getApi'
        ]),
        initApi() {
            if (this.$route.name === 'Edit' && this.$route.params.apiId !== this.api._id) {
                this.loading = true;
                this.getApi(this.$route.params).then(() => {
                    this.loading = false;
                }).catch(err => {
                    this.$message.error(`获取数据失败:${err.response.data.message}`);
                    this.loading = false;
                });
            } else {
                this.loading = false;
            }
        }
    },
    computed: mapState(['api', 'mode']),
    mounted() {
        this.initApi();
    },
    watch: {
        $route(to, from) {
            if (from.name === 'Create' && to.name === 'Edit' && !this.loading) {
                this.initApi();
            }
        }
    }
};
</script>
<style>
</style>
