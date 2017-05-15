<template>
  <div class="content" :class="mode">
    <el-row type="flex" class="list-content" v-if="!loading">
        <api-info></api-info>
        <api-box></api-box>
    </el-row>
    <div class="loading" v-show="loading">
        <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
    </div>
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
            // loadingService: Loading.service({target: this.$el});,
        };
    },
    methods: {
        ...mapActions([
            'getApi'
        ]),
        beginLoading() {
            this.loading = true;
        },
        endLoading() {
            this.loading = false;
        },
        initApi() {
            this.beginLoading();
            if (this.$route.name === 'Create') {
                this.$store.commit('INIT_API');
                this.endLoading();
            } else {
                this.getApi(this.$route.params).then(() => {
                    this.endLoading();
                }).catch(err => {
                    this.$message.error(`获取数据失败:${err.response.data.message}`);
                    this.endLoading();
                });
            }
            this.$store.commit('CHANGE_MODE', 'edit');
            window.setTimeout(() => {
                this.$store.commit('SAVE_API');
            });
        }
    },
    computed: mapState(['api', 'mode', 'apiUnsaved']),
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.initApi();
        });
    },
    beforeRouteLeave(to, from, next) {
        if (this.apiUnsaved) {
            this.$confirm('有未保存的内容, 是否离开?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                next();
            }).catch(() => {});
        } else {
            next();
        }
    }
};
</script>
<style scoped>
.content {
    position: absolute !important;
}
</style>
