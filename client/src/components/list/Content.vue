<template>
    <el-col :span="24">
        <div class="content-wrap">
            <div id="content">
                <search @query="onQuery"></search>
                <api-list></api-list>
                <page-nav :query="query" :total="count" :on-page-nav="onPageNav"></page-nav>
            </div>
        </div>
    </el-col>
</template>
<script>
import Search from './Search';
import ApiList from './ApiList';
import PageNav from './PageNav';
import { mapState } from 'vuex';
export default {
    components: {
        Search,
        PageNav,
        ApiList
    },
    data() {
        return {
            query: this.initQuery(),
            count: 0
        };
    },
    mounted() {
        Promise.all([this.getData(true)]);
    },
    watch: {
        $route(to) {
            if (to.matched[0].path === '/list' && !this.apiListLoading) {
                this.getData(true);
            }
        }
    },
    methods: {
        initQuery() {
            return {
                q: '',
                limit: 16,
                page: 1
            };
        },
        getData(isInit) {
            window.console.log(isInit);
            if (isInit) {
                this.initQuery();
            }
            this.$store.dispatch('getApiList', {
                groupId: this.$route.params.groupId,
                query: this.query
            }).then(res => {
                const pages = res.data.pages;
                this.query.page = pages.page;
                this.count = pages.count;
            }).catch(() => {
                this.$message.error('加载数据失败');
            });
        },
        onPageNav(currentPage) {
            window.console.log('page nav');
            window.console.log(currentPage);
            window.console.log(this.query.page);
            if (currentPage === this.query.page) {
                return;
            }
            this.query.page = currentPage;
            if (this.apiListLoading) {
                return;
            }
            this.getData();
        },
        onQuery(filter) {
            this.query.q = filter;
            if (this.inputShakeTime || this.apiListLoading) {
                return;
            }
            this.inputShakeTime = setTimeout(() => {
                this.getData();
                this.inputShakeTime = null;
            }, 500);
        }
    },
    computed: mapState(['apiList', 'apiListLoading'])
};
</script>
<style>
.content-wrap {
    padding: 20px;
    background-color: #F9FAFC;
    min-height: 100%;
    position: relative;
}
.content {
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
.api-list-box {
    /*margin: 10px -10px;*/
    /*width: 100%;*/
    position: absolute;
    top: 65px;
    bottom: 90px;
    overflow-y: auto;
    left: 10px;
    right: 10px;
}
.api-list {
    min-height: 100%;
}
.api-list li {
    display: inline-block;
    margin: 10px;
}
.api-list li.empty {
    color: #D3DCE6;
    text-align: center;
    display: block;
    margin: 0;
    padding-top: 100px;
}
.api-list li ~li.empty {
    display: none;
}
</style>
