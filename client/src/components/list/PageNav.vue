<template>
    <div class="page-nav">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageData.offset"
          :page-size="pageData.limit"
          layout="prev, pager, next, jumper"
          :total="pageData.count">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        pageData: {
            type: Object,
            default() {
                return {
                    count: 0,
                    limit: 30,
                    offset: 0
                };
            }
        }
    },
    methods: {
        handleCurrentChange(val) {
            window.console.log(val);
            this.$store.dispatch('getApiList', {
                offset: val
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
