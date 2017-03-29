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
            const { groupId } = this.$route.params;
            const query = this.query;
            let apiList = this.$store.state.apiList;
            if (groupId) {
                apiList = R.filter(R.propEq('group', groupId), apiList);
            }
            if (query) {
                apiList = R.filter(
                    R.anyPass(
                        [
                            R.compose(R.contains(query), R.prop('name')),
                            R.compose(R.contains(query), R.propOr('', 'desc')),
                            R.compose(R.contains(query), R.prop('url')),
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
    height: 100%;
}
.content {
    text-align: left;
}
.api-list {
    margin: 10px -10px;
}
.api-list li {
    display: inline-block;
    margin: 10px;
}
</style>
