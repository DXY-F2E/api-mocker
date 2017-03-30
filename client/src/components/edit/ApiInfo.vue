<template>
    <div class="api-info el-col">
        <el-form>
            <el-form-item label="接口名称">
                <el-input auto-complete="off" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="接口分组">
                <div class="group-select">
                    <el-row type="flex" >
                        <el-col :span="24">
                            <el-select placeholder="请选择分组" v-model="group">
                                <el-option v-for="group in groups"
                                           :key="group._id"
                                           :label="group.name"
                                           :value="group._id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="接口描述">
                <el-input type="textarea" v-model="desc" placeholder="选填" :rows="4"></el-input>
            </el-form-item>
        </el-form>
        <p class="issue">
            <a href="http://gitlab.dxy.net/f2e/api-mocker/issues" target="_blank">Click For Help</a>
        </p>
    </div>
</template>

<script>
export default {
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
.api-info {
    padding: 20px;
    width: 288px;
    min-width: 288px;
    background-color: #eef1f6;
}
.api-info .el-textarea__inner,
.api-info .el-input__inner {
    background-color: #F9FAFC;
}
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
.issue {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    width: 100%;
}
.issue a {
    color: #99A9BF;
    font-size: 12px;
}
</style>
