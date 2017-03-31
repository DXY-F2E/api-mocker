<template>
    <div class="page-nav">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageData.page"
          :page-size="pageData.limit"
          layout="prev, pager, next, jumper"
          :total="pageData.count">
        </el-pagination>
    </div>
</template>

<script>
export default {
    // props: {
    //     pageData: {
    //         type: Object,
    //         default() {
    //             return {
    //                 count: 0,
    //                 limit: 30,
    //                 page: 0
    //             };
    //         }
    //     }
    // },
    computed: {
        pageData() {
            return this.$store.state.apiPage;
        },
        apiLoading() {
            return this.$store.state.apiListLoading;
        }
    },
    methods: {
        handleCurrentChange(currentPage) {
            window.console.log(currentPage);
            window.console.log(this.apiLoading);
            if (this.apiLoading || currentPage === this.pageData.page) {
                return;
            }
            this.$store.dispatch('getApiList', {
                page: currentPage,
                limit: this.pageData.limit
            }).catch(err => {
                window.console.log(err);
                this.$message.error('加载数据失败');
            });
        }
    }
};
</script>
<style>
.page-nav {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    text-align: center;
}
</style>
