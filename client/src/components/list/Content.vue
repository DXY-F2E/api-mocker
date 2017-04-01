<template>
    <el-col :span="24">
        <div class="content-wrap">
            <div id="content">
                <search @query="onQuery"></search>
                <div class="api-list-box">
                    <ul class="api-list" v-loading="apiListLoading">
                        <li v-for="(api, idx) in apiList">
                            <api :data="api" :index="idx"></api>
                        </li>
                        <li class="empty">暂无接口</li>
                    </ul>
                </div>
                <page-nav></page-nav>
            </div>
        </div>
    </el-col>
</template>
<script>
import Search from './Search';
import Api from './Api';
import PageNav from './PageNav';
import { mapState } from 'vuex';
export default {
    components: {
        Search,
        PageNav,
        Api
    },
    data() {
        return {
            query: ''
        };
    },
    methods: {
        onQuery(query) {
            this.query = query;
            if (this.inputShakeTime) {
                return;
            }
            this.inputShakeTime = setTimeout(() => {
                this.$store.dispatch('search', {
                    groupId: this.$route.params.groupId,
                    q: this.query
                });
                this.inputShakeTime = null;
            }, 500);
        }
    },
    computed: mapState(['apiList', 'apiListLoading', 'apiListSuccess', 'apiPage'])
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
