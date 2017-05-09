<template>
    <div class="api-list-box">
        <ul class="api-list" v-loading="apiListLoading">
            <li v-for="(api, idx) in apiList">
                <api :data="api" :index="idx"></api>
            </li>
            <li class="add-api" @click="createApi">
                <el-card><i class="el-icon-plus"></i>创建接口</el-card>
            </li>
            <li class="empty">暂无接口</li>
        </ul>
    </div>
</template>

<script>
import Api from './Api';
import { mapState } from 'vuex';

export default {
    components: {
        Api
    },
    methods: {
        createApi() {
            this.$router.push('/create');
        }
    },
    computed: mapState(['apiList', 'apiListLoading'])
};
</script>
<style>
.add-api .el-card .el-card__body {
    height: 105px;
    line-height: 75px;
    text-align: center;
    font-size: 16px;
    color: #324057;
}
.add-api i {
    font-size: 18px;
    color: #99A9BF;
    margin-right: 10px;
    /*vertical-align: sub;*/
}
</style>
