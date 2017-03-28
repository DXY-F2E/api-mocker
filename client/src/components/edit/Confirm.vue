<template>
    <el-dialog title="填写接口信息" v-model="createDialog">
        <el-form>
            <el-form-item label="名称">
                <el-input auto-complete="off" v-model="api.name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="api.desc"></el-input>
            </el-form-item>
            <el-form-item label="分组">
                <div class="group-select">
                    <el-row type="flex" >
                        <el-col :span="24">
                            <el-select placeholder="请选择活动区域" v-model="api.group">
                                <el-option v-for="group in groups"
                                           :key="group.id"
                                           :label="group.name"
                                           :value="group.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <!-- <i class="el-icon-plus"></i> -->
                    </el-row>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">取 消</el-button>
        <el-button type="primary" @click="createDialog = false">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            formLabelWidth: 100
        };
    },
    computed: {
        createDialog() {
            return this.$store.state.createDialog;
        },
        groups() {
            return this.$store.state.groups;
        },
        api() {
            return this.$store.state.api;
        }
    }
};
</script>
<style>
.group-select {
    display: inline-block;
    width: 100%;
}
.group-select .el-icon-plus {
    width: 50px;
    line-height: 36px;
}
.group-select .el-select {
    width: 100%;
}
</style>
