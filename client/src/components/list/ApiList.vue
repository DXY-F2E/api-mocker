<template>
    <div class="api-list-box">
        <ul class="api-list" v-loading="apiListLoading">
            <li v-for="(api, idx) in apiList">
                <api :data="api" :index="idx"></api>
            </li>
            <template v-if="groupId">
                <li class="add-api" @click="createApi">
                    <el-card><i class="el-icon-plus"></i>创建接口</el-card>
                </li>
                <li class="add-api">
                    <el-card>
                        <import-rap-json :group-id="groupId"></import-rap-json>
                    </el-card>
                </li>
            </template>
            <li class="empty">暂无接口</li>
        </ul>
    </div>
</template>

<script>
import Api from './Api';
import { mapState } from 'vuex';
import ImportRapJson from '../common/importJson/FromRap';

export default {
    components: {
        Api,
        ImportRapJson
    },
    computed: {
        ...mapState(['apiList', 'apiListLoading']),
        groupId() {
            return this.$route.params.groupId;
        }
    },
    methods: {
        createApi() {
            const query = this.groupId ? `?this.groupId=${this.groupId}` : '';
            this.$router.push(`/create${query}`);
        }
    }
};
</script>
<style>
.api-list {
    overflow: hidden;
}
.api-list li {
    float: left;
}
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
}
.add-api .el-upload {
    width: 100%;
}
</style>
