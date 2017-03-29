<template>
  <div class="content">
    <el-row type="flex" class="list-content" v-if="!loading">
        <api-info></api-info>
        <api-box></api-box>
    </el-row>
  </div>
</template>

<script>
import ApiInfo from './ApiInfo';
import ApiBox from './ApiBox';
import { mapActions } from 'vuex';
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
            'getApi' // 映射 this.increment() 为 this.$store.commit('increment')
        ]),
        initApi() {
            if (this.$route.name === 'Edit' && this.$route.params.apiId !== this.api._id) {
                // this.$store.dispatch('getApi');
                this.getApi(this.$route.params).then(res => {
                    this.$store.commit('UPDATE_API', res.data.resources);
                    this.loading = false;
                }).catch(err => {
                    this.$message.error(`获取数据失败:${err.res.data.message}`);
                    this.loading = false;
                });
            } else {
                this.loading = false;
            }
        }
    },
    computed: {
        api() {
            return this.$store.state.api;
        }
    },
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
.api-box {
    margin: 20px;
}
</style>
