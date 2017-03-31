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
            </div>
        </div>
    </el-col>
</template>
<script>
import Search from './Search';
import Api from './Api';
import { mapState } from 'vuex';
export default {
    components: {
        Search,
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
    computed: mapState(['apiList', 'apiListLoading', 'apiListSuccess'])
};
</script>
<style>
.content-wrap {
    padding: 20px;
    background-color: #F9FAFC;
    min-height: 100%;
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
    margin: 10px -10px;
}
.api-list li {
    display: inline-block;
    margin: 10px;
}
</style>
