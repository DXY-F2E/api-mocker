<template>
    <div class="url-box">
        <el-row type="flex">
            <el-col :span="24">
                <el-input placeholder="Url保存后自动生成" readonly v-model="url">
                    <el-select v-model="method" slot="prepend" placeholder="请选择">
                        <el-option label="GET" value="get"></el-option>
                        <el-option label="POST" value="post"></el-option>
                        <el-option label="PUT" value="put"></el-option>
                        <el-option label="DELETE" value="delete"></el-option>
                    </el-select>
                    <!-- <el-button slot="append">Copy</el-button> -->
                    <copy-button slot="append" :copy-data="url" :disabled="creating">Copy</copy-button>
                </el-input>
            </el-col>
            <el-col class="control">
                <el-button id="saveAct" type="info" @click="validate()" v-if="mode === 'edit'">Save</el-button>
                <el-button id="editAct" type="success" @click="send()" v-else>Send</el-button>
            </el-col>
            <!-- 2.0来实现 -->
            <el-col class="mode" v-if="api._id">
                <el-select v-model="mode" placeholder="请选择" >
                    <el-option label="编辑模式" value="edit"></el-option>
                    <el-option label="测试模式" value="test"></el-option>
                </el-select>
                <!-- <el-button @click="changeMode()">{{modeName}}模式</el-button> -->
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import CopyButton from '../common/CopyButton';
import { validateApi } from '../../util';
export default {
    components: {
        CopyButton
    },
    data() {
        return {
            isShowDialog: false
        };
    },
    methods: {
        ...mapActions([
            'saveApi',
            'testApi'
        ]),
        save() {
            this.saveApi().then(() => {
                if (this.$route.name === 'Create' && this.api._id) {
                    this.$router.push({
                        name: 'Edit',
                        params: {
                            groupId: this.api.group,
                            apiId: this.api._id
                        }
                    });
                }
                this.$message.success('保存成功');
            }).catch(err => {
                window.console.log(err);
                this.$message.error(`创建失败:${err.response.data.message}`);
            });
        },
        changeMode() {
            this.$store.commit('CHANGE_MODE');
        },
        validate() {
            const { status, msg } = validateApi(this.$store.state);
            if (status) {
                this.save();
            } else {
                this.$message.error(msg);
            }
        },
        send() {
            this.testApi();
        }
    },
    computed: {
        // mode() {
        //     return this.$store.state.mode;
        // },
        mode: {
            get() {
                return this.$store.state.mode;
            },
            set() {
                this.$store.commit('CHANGE_MODE');
            }
        },
        modeName() {
            return this.$store.state.mode === 'edit' ? '编辑' : '测试';
        },
        api() {
            return this.$store.state.api;
        },
        creating() {
            return this.$store.state.api._id === undefined;
        },
        url() {
            return this.api.url ? this.$store.state.serverRoot + this.api.url : '';
        },
        method: {
            get() {
                return this.$store.state.api.options.method;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['options.method', value]);
            }
        }
    }
};
</script>
<style>
.url-box .el-select .el-input__inner {
    width: 104px;
}
.url-box .el-input__inner:hover,
.url-box .el-input__inner:focus {
    border-color: #bfcbd9;
}
.url-box .control{
    width: 108px;
    text-align: right;
}
.url-box .el-input-group__append {
    padding: 0;
    overflow: hidden;
}
.url-box .el-input-group__append .el-button:last-child {
    border-right: 0;
}
.url-box .el-input-group__append .el-button {
    display: inline-block;
    vertical-align: middle;
    border-right: 1px solid #bfcbd9;
    margin: 0px;
    border-radius: 0;
    width: 70px;
    text-align: center;
}
.url-box .el-input-group__append .el-button.is-disabled {
    border-color: #bfcbd9;
    border-left: none;
    background-color: #eef1f6;
    color: #bfcbd9;
}
.url-box .el-input-group__append .el-button:not(.is-disabled):hover {
    color: #324057;
}
#editAct,
#saveAct {
    width: 70px;
}
.url-box .el-col.mode{
    width: 150px;
    text-align: right;
}
</style>
