<template>
<el-dialog :title="title" :visible="visible" @open="getApiAuthority" :show-close="false">
    <el-form v-if="authority" v-stop-default-enter>
        <el-form-item label="编辑权限：">
            <el-radio-group v-model="authority.operation.mode">
                <el-radio :label="0">所有人</el-radio>
                <el-radio :label="1">指定</el-radio>
            </el-radio-group>
            <filter-selector
                v-show="authority.operation.mode === 1"
                :value="operator"
                :remoteMethod="searchUsers"
                :options="users"
                @change="updateOperator">
            </filter-selector>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
import FilterSelector from '../common/FilterSelector';
export default {
    components: {
        FilterSelector
    },
    props: {
        api: Object,
        visible: Boolean
    },
    data() {
        return {
            users: [],
            authority: null
        };
    },
    computed: {
        allUsers() {
            return this.$store.state.allUsers;
        },
        title() {
            return `${this.api.name}`;
        },
        operator() {
            return this.authority.operation.operator;
        }
    },
    methods: {
        searchUsers(val) {
            this.users = this.allUsers.filter(u =>
                u.email.indexOf(val) >= 0 || u.name.indexOf(val) >= 0
            );
        },
        initUsers(operators) {
            this.users = operators.map(id =>
                this.allUsers.find(u => u._id === id)
            );
        },
        getApiAuthority() {
            this.$store.dispatch('getApiAuthority', this.api._id).then(rs => {
                this.initUsers(rs.data.operation.operator);
                this.authority = rs.data;
            });
        },
        updateOperator(operators) {
            this.authority.operation.operator = operators;
        },
        cancel() {
            this.$emit('hide');
        },
        confirm() {
            this.$store.dispatch('updateApiAuthority', this.authority).then(rs => {
                this.$message.success(rs.data);
                this.$emit('hide');
            }).catch(this.$message.error);
        }
    }
};
</script>
<style>
.filter-selector {
    width: auto;
    display: block;
    margin: 10px 0 0 82px;
}
</style>
