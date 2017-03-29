<template>
    <el-dialog title="填写接口信息" v-model="isShowDialog">
        <el-form>
            <el-form-item label="名称">
                <el-input auto-complete="off" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="desc" placeholder="选填"></el-input>
            </el-form-item>
            <el-form-item label="分组">
                <div class="group-select">
                    <el-row type="flex" >
                        <el-col :span="24">
                            <el-select placeholder="请选择活动区域" v-model="group">
                                <el-option v-for="group in groups"
                                           :key="group._id"
                                           :label="group.name"
                                           :value="group._id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <!-- <i class="el-icon-plus"></i> -->
                    </el-row>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="createApi()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            formLabelWidth: 100,
            isShowDialog: false
        };
    },
    methods: {
        isEmpty(val) {
            return val === undefined || val.trim() === '' || val === null;
        },
        validate() {
            if (this.isEmpty(this.name)) {
                this.$message.error('接口名称不能为空');
                return false;
            } else if (this.isEmpty(this.group)) {
                this.$message.error('接口分组不能为空');
                return false;
            }
            return true;
        },
        createApi() {
            if (this.validate()) {
                this.$store.dispatch('createApi', {
                    success: this.success,
                    fail: this.fail
                });
            }
        },
        success() {
            this.$message('创建成功');
        },
        fail(error) {
            this.$message.error(`创建失败:${error}`);
        }
    },
    computed: {
        groups() {
            return this.$store.state.groups;
        },
        name: {
            get() {
                return this.$store.state.api.name;
            },
            set(value) {
                this.$store.commit('UPDATE_API_NAME', value);
            }
        },
        desc: {
            get() {
                return this.$store.state.api.desc;
            },
            set(value) {
                this.$store.commit('UPDATE_API_DESC', value);
            }
        },
        group: {
            get() {
                return this.$store.state.api.group;
            },
            set(value) {
                this.$store.commit('UPDATE_API_GROUP', value);
            }
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
.group-select .el-select .el-input__inner,
.group-select .el-select {
    width: 100%;
}
</style>
