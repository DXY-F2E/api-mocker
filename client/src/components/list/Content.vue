<template>
    <el-col :span="24">
        <div class="content-wrap">
            <div id="content" v-loading="apiListLoading">
                <search @query="onQuery"></search>
                <ul class="api-list">
                    <li v-for="(api, idx) in apiList">
                        <api :data="api" :index="idx"></api>
                    </li>
                </ul>
                <page-nav :page-data="apiPage"></page-nav>
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
}
.api-list {
    /*margin: 10px -10px;*/
    /*width: 100%;*/
    position: absolute;
    top: 65px;
    bottom: 90px;
    overflow-y: auto;
    left: 10px;
    right: 10px;
}
.api-list li {
    display: inline-block;
    margin: 10px;
}
</style>
