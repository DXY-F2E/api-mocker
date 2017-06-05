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
        prop="crateTime"
        label="创建时间">
      </el-table-column>
    </el-table>
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            apis: []
        };
    },
    methods: {
        ...mapActions([
            'getManageApi'
        ]),
        getApis() {
            this.getManageApi().then(rs => {
                this.apis = rs.data;
            });
        }
    },
    mounted() {
        this.getApis();
    }
};
</script>
<style>
</style>
