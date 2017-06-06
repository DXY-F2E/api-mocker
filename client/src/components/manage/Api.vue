<template>
<div class="manage-api">
    <el-table
      :data="apis"
      style="width: 100%">
      <el-table-column
        prop="options.method"
        label="方法"
        width="70">
      </el-table-column>
      <el-table-column
        prop="name"
        label="接口名">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="timeFormat"
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="160"
        label="操作">
        <template scope="scope">
            <control :api="scope.row" @delete="apiDelete"></control>
        </template>
      </el-table-column>
    </el-table>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';
import Control from './ApiControl';
export default {
    components: {
        Control
    },
    data() {
        return {
            apis: []
        };
    },
    methods: {
        ...mapActions([
            'getManageApi'
        ]),
        timeFormat(row, col) {
            return moment(new Date(Number(row[col.property]))).format('YYYY-MM-DD HH:mm:ss');
        },
        getApis() {
            this.getManageApi().then(rs => {
                this.apis = rs.data;
            });
        },
        apiDelete(api) {
            const index = this.apis.findIndex(a => a === api);
            this.apis.splice(index, 1);
        }
    },
    mounted() {
        this.getApis();
    }
};
</script>
<style>
</style>
