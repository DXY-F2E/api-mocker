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
                    <el-button slot="append" @click="validate()">Save</el-button>
                </el-input>
            </el-col>
            <!-- 2.0来实现 -->
            <!-- <el-col class="mode">
                <el-button>测试模式</el-button>
            </el-col> -->
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
            'saveApi'
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
        validate() {
            const { status, msg } = validateApi(this.$store.state);
            if (status) {
                this.save();
            } else {
                this.$message.error(msg);
            }
        }
    },
    computed: {
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
                this.$store.commit('UPDATE_API_PROPS', ['method', value]);
            }
        }
    }
};
</script>
<style>
.url-box .el-select .el-input__inner {
    width: 100px;
}
.url-box .el-input__inner:hover,
.url-box .el-input__inner:focus {
    border-color: #bfcbd9;
}
.url-box .control{
    width: 80px;
    text-align: right;
}
.url-box .el-input-group__append {
    padding: 0;
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
}
.url-box .el-input-group__append .el-button.is-disabled {
    border-color: #bfcbd9;
    border-left: none;
    background-color: #eef1f6;
    color: #bfcbd9;
}
.url-box .el-input-group__append .el-button:not(.is-disabled):hover {
    color: #324057;
    /*background-color: #C0CCDA;*/
}
.url-box .el-col.mode{
    width: 150px;
    text-align: right;
}
</style>
