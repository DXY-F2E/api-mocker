<template>
<div class="manage-group">
    <div class="mode-switch" :class="mode">
        <el-button size="small" class="managed" @click.native="getGroups">我的分组</el-button>
        <el-button size="small" class="unmanaged" @click.native="getUnmanaged">未认领分组</el-button>
    </div>
    <div class="group-table">
        <el-table
          :data="groups"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="分组名">
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
                <control :group="scope.row" :mode="mode" @delete="groupDelete"></control>
            </template>
          </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';
import Control from './GroupControl';
export default {
    components: {
        Control
    },
    data() {
        return {
            mode: 'managed',
            groups: []
        };
    },
    methods: {
        ...mapActions([
            'getManageGroup',
            'getUnmanagedGroup'
        ]),
        timeFormat(row, col) {
            return moment(new Date(Number(row[col.property]))).format('YYYY-MM-DD HH:mm:ss');
        },
        getUnmanaged() {
            this.getUnmanagedGroup().then(rs => {
                this.groups = rs.data;
                this.mode = 'unmanaged';
            });
        },
        getGroups() {
            this.getManageGroup().then(rs => {
                this.groups = rs.data;
                this.mode = 'managed';
            });
        },
        groupDelete(group) {
            const index = this.groups.findIndex(a => a === group);
            this.groups.splice(index, 1);
        }
    },
    mounted() {
        this.getGroups();
    }
};
</script>
<style>
.mode-switch {
    margin-bottom: 20px;
}
.managed .managed,
.unmanaged .unmanaged {
    color: #20a0ff;
    border-color: #20a0ff;
}
</style>
