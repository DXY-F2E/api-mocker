<template>
    <el-col :span="24">
        <div class="content-wrap">
            <div id="content">
                <search @query="onQuery"></search>
                <ul class="api-list">
                    <li v-for="api in apiList">
                        <api :data="api"></api>
                    </li>
                </ul>
            </div>
        </div>
    </el-col>
</template>
<script>
import Search from './Search';
import Api from './Api';
import R from 'ramda';
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
        }
    },
    computed: {
        apiList() {
            const query = this.query;
            let apiList = this.$store.state.apiList;
            const propOr = R.curry((d, prop, obj) => {
                if (prop in obj) {
                    return obj[prop] || d;
                } else {
                    return d;
                }
            });
            if (query) {
                apiList = R.filter(
                    R.anyPass(
                        [
                            R.compose(R.contains(query), propOr('', 'name')),
                            R.compose(R.contains(query), propOr('', 'desc')),
                            R.compose(R.contains(query), propOr('', 'url')),
                            R.compose(R.contains(query), R.pathOr('', ['options', 'method']))
                        ]), apiList);
            }
            return apiList;
        }
    }
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
}
.content > .el-row > .el-col {
    height: 100%;
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
