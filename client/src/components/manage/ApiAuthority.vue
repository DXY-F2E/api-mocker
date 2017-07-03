<template>
<el-dialog :title="title" :visible="visible">
    <!-- <el-form>
        <el-form-item label="隐私性：">
            <el-radio-group v-model="api.authority.privacy">
                <el-radio :label="0">公开</el-radio>
                <el-radio :label="1">私有</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="编辑权限：">
            <el-radio-group v-model="api.authority.operation">
                <el-radio :label="0">所有人</el-radio>
                <el-radio :label="1">指定</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form> -->
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
    computed: {
        title() {
            return `${this.api.name} 权限设置`;
        }
    },
    methods: {
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
