<template>
<el-dialog :title="title" :visible="visible" @open="getApiAuthority">
    <el-form v-if="authority" v-stop-default-enter>
        <el-form-item label="编辑权限：">
            <el-radio-group v-model="authority.operation.mode">
                <el-radio :label="0">所有人</el-radio>
                <el-radio :label="1">指定</el-radio>
            </el-radio-group>
            <input-finder class="operator"
                          @enter="searchUsers"
                          :selected-data="authority.operation.operator"
                          :query-data="queryData">
            </input-finder>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
import InputFinder from '../common/InputFinder';
export default {
    components: {
        InputFinder
    },
    props: {
        api: Object,
        visible: Boolean
    },
    data() {
        return {
            query: '',
            queryData: [],
            authority: null
        };
    },
    computed: {
        title() {
            return `${this.api.name} 权限设置`;
        }
    },
    methods: {
        searchUsers(val) {
            this.$store.dispatch('searchUsers', val).then(rs => {
                window.console.log(rs);
            });
        },
        getApiAuthority() {
            this.$store.dispatch('getApiAuthority', this.api._id).then(rs => {
                this.authority = rs.data;
                this.authority.operation.operator = [{
                    _id: 1,
                    name: '相学长'
                }, {
                    _id: 2,
                    name: '李权威'
                }];
            });
        },
        cancel() {
            this.$emit('hide');
        },
        confirm() {
            this.$emit('hide');
        }
    }
};
</script>
<style>
</style>
