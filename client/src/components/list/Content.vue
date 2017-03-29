<template>
    <el-col :span="24">
        <div class="content-wrap">
            <div id="content">
                <search></search>
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
export default {
    components: {
        Search,
        Api
    },
    computed: {
        apiList() {
            return this.$store.state.apiList;
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
