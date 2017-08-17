<template>
    <div class="api-info el-col" v-side-bar>
        <el-form>
            <el-form-item label="接口名称" class="required">
                <el-input auto-complete="off" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="接口分组" class="required">
                <i class="el-icon-plus title-icon create-group" @click="showCreateGroup = true"></i>
                <div class="group-select">
                    <el-row type="flex" >
                        <el-col :span="24">
                            <el-select placeholder="请选择分组" filterable v-model="group">
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
            <el-form-item label="测试地址">
                <el-input auto-complete="off" v-model="devUrl" placeholder="请填写绝对路径"></el-input>
            </el-form-item>
            <el-form-item label="线上地址">
                <el-input auto-complete="off" v-model="prodUrl" placeholder="请填写绝对路径"></el-input>
            </el-form-item>
            <el-form-item label="代理转发">
                <el-tooltip content="开启后请求mock地址会转发到指定地址" placement="top"><span class="mocker-tip">?</span></el-tooltip>
                <el-radio-group v-model="proxyMode">
                    <el-radio :label="0">不转发</el-radio>
                    <el-radio :label="1">转发线上</el-radio>
                    <el-radio :label="2">转发测试</el-radio>
                </el-radio-group>
                <!-- <el-switch v-model="proxyMode"
                           :on-value="1"
                           :off-value="0"></el-switch> -->
            </el-form-item>
            <el-form-item label="历史记录" class="history-item" v-if="history && history.records.length">
                <api-history :history="history"></api-history>
            </el-form-item>

            <!-- <el-form-item >
                <el-button type="info">文档</el-button>
            </el-form-item> -->
        </el-form>
        <p class="issue">
            <a href="http://gitlab.dxy.net/f2e/api-mocker/wikis/home" target="_blank">Click For Help</a>
            <a href="http://gitlab.dxy.net/f2e/api-mocker/issues" target="_blank">Issue</a>
        </p>
        <create-group
            :visited="showCreateGroup"
            @action="handleClickCreateGroup"
            @close="handleClickClose"/>
    </div>
</template>

<script>
import createGroup from '../../dialog/create-group';
import ApiHistory from './ApiHistory';
export default {
    components: {
        createGroup,
        ApiHistory
    },
    data() {
        return {
            showCreateGroup: false
        };
    },
    methods: {
        handleClickCreateGroup(groupName) {
            this.$store.dispatch('createGroup', { name: groupName }).then(() => {
                this.showCreateGroup = false;
            }).catch(e => this.$message.error(e.msg));
        },
        handleClickClose() {
            this.showCreateGroup = false;
        }
    },
    created() {
        this.originTitle = document.title;
    },
    beforeDestroy() {
        document.title = this.originTitle;
    },
    computed: {
        groups() {
            return this.$store.state.groups;
        },
        history() {
            return this.$store.state.api.history;
        },
        name: {
            get() {
                document.title = this.$store.state.api.name || '未命名接口';
                return this.$store.state.api.name;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['name', value]);
            }
        },
        prodUrl: {
            get() {
                return this.$store.state.api.prodUrl;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['prodUrl', value]);
            }
        },
        devUrl: {
            get() {
                return this.$store.state.api.devUrl;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['devUrl', value]);
            }
        },
        proxyMode: {
            get() {
                return this.$store.state.api.options.proxy.mode;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['options.proxy.mode', value]);
            }
        },
        group: {
            get() {
                return this.$store.state.api.group;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['group', value]);
            }
        }
    }
};
</script>
<style lang="less">
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
.api-info .el-form {
    min-height: 100%;
    padding-bottom: 50px;
}
.api-info .create-group {
    color: #97a8be;
    cursor: pointer;
}
.issue {
    text-align: center;
    margin-top: -30px;
}
.issue a {
    color: #99A9BF;
    font-size: 12px;
    margin: 0 35px;
}
.el-form-item.required .el-form-item__label:after {
    content: '*';
    color: #ff4949;
    margin-left: 2px;
}
.api-info .history {
    display: inline-block;
    width: 100%;
}
.api-info .el-radio-group {
    display: block;
    margin-top: 5px;
    .el-radio {
        /*margin-left: 15px;*/
        display: block;
        margin: 5px 0;
        color: #475669;
        font-family: monospace;

        &__label {
            margin-left: 5px;
        }
    }
}

</style>
