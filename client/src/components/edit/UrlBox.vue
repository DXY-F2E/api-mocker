<template>
    <div class="url-box">
        <el-input placeholder="Url保存后自动生成" readonly v-model="url">
            <el-select v-model="method" slot="prepend" placeholder="请选择">
                <el-option label="GET" value="get"></el-option>
                <el-option label="POST" value="post"></el-option>
                <el-option label="PUT" value="put"></el-option>
                <el-option label="DELETE" value="delete"></el-option>
            </el-select>
            <el-button slot="append" @click="validate()">Save</el-button>
        </el-input>
    </div>
</template>

<script>
import Confirm from './Confirm';
import { mapActions } from 'vuex';
export default {
    components: {
        Confirm
    },
    data() {
        return {
            isShowDialog: false
        };
    },
    methods: {
        ...mapActions([
            'validateApi',
            'saveApi'
        ]),
        save() {
            this.saveApi().then(res => {
                this.$message('保存成功');
                this.$store.commit('UPDATE_API', res.data.resources);
            }).catch(err => {
                window.console.log(err.response);
                this.$message.error(`创建失败:${err.response.data.message}`);
            });
        },
        validate() {
            this.validateApi().then(rs => {
                if (rs.status) {
                    this.save();
                } else {
                    this.$message.error(rs.msg);
                }
            });
        }
    },
    computed: {
        api() {
            return this.$store.state.api;
        },
        url() {
            return this.$store.state.api.url;
        },
        method: {
            get() {
                return this.$store.state.api.options.method;
            },
            set(value) {
                this.$store.commit('UPDATE_API_METHOD', value);
            }
        }
    }
};
</script>
<style>
.url-box .el-select .el-input__inner {
    width: 100px;
}
</style>
