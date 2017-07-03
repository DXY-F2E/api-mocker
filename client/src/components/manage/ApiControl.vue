<template>
<div class="api-control">
    <el-button type="text" size="small" @click="apiManage">权限</el-button>
    <el-button type="text" size="small" @click="apiEdit">编辑</el-button>
    <el-button type="text" size="small" @click="apiDoc">文档</el-button>
    <el-button type="text" size="small" @click="apiDelete">删除</el-button>
    <api-authority :visible="showAuthority" @hide="showAuthority = false" :api="api"></api-authority>
</div>
</template>

<script>
import ApiAuthority from './ApiAuthority';
export default {
    components: {
        ApiAuthority
    },
    props: {
        api: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showAuthority: false
        };
    },
    methods: {
        confirmDelete() {
            this.$store.dispatch('deleteApi', {
                api: this.api
            }).then(() => {
                this.$message.success('删除成功');
                this.$emit('delete', this.api);
            }).catch(err => this.$message.error(err.msg));
        },
        apiManage() {
            this.showAuthority = true;
            window.console.log(this.showAuthority);
        },
        apiDoc() {
            this.$router.push({
                name: 'ApiDoc',
                params: {
                    groupId: this.api.group,
                    apiId: this.api._id
                }
            });
        },
        apiEdit() {
            this.$router.push({
                name: 'Edit',
                params: {
                    groupId: this.api.group,
                    apiId: this.api._id
                }
            });
        },
        apiDelete() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmDelete();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
};
</script>
<style>
</style>
