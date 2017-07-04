<template>
<el-dialog :title="title" :visible="visible" @open="getApiAuthority">
    <el-form v-if="authority">
        <el-form-item label="编辑权限：">
            <el-radio-group v-model="authority.operation.mode">
                <el-radio :label="0">所有人</el-radio>
                <el-radio :label="1">指定</el-radio>
            </el-radio-group>
            <div class="operator">
                <span v-for="o in authority.operation.operator" :key="o._id">{{o.name}}</span>
                <input type="text" v-model="query" @change="searchUsers">
            </div>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
export default {
    props: {
        api: Object,
        visible: Boolean
    },
    data() {
        return {
            query: '',
            authority: null
        };
    },
    computed: {
        title() {
            return `${this.api.name} 权限设置`;
        }
    },
    methods: {
        searchUsers() {
            this.$store.dispatch('searchUsers', this.query).then(rs => {
                window.console.log(rs);
            });
        },
        getApiAuthority() {
            this.$store.dispatch('getApiAuthority', this.api._id).then(rs => {
                this.authority = rs.data;
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
