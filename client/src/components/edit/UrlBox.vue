<template>
    <div class="url-box">
        <el-input placeholder="Url保存后自动生成" readonly v-model="url">
            <el-select v-model="method" slot="prepend" placeholder="请选择">
                <el-option label="GET" value="get"></el-option>
                <el-option label="POST" value="post"></el-option>
                <el-option label="PUT" value="put"></el-option>
                <el-option label="DELETE" value="delete"></el-option>
            </el-select>
            <el-button slot="append" @click="saveApi()">Save</el-button>
        </el-input>
        <confirm ref="confirmBox"></confirm>
    </div>
</template>

<script>
import Confirm from './Confirm';
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
        saveApi() {
            if (this.api.id !== undefined) {
                this.$store.dispatch('saveApi');
            } else {
                this.$refs.confirmBox.isShowDialog = true;
            }
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
