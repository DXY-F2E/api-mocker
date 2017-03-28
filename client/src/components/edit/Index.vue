<template>
  <div class="main">
    <div class="api-box">
        <div class="url-box">
            <el-input placeholder="Url保存后自动生成" readonly :disabled="true" v-model="api.name">
                <el-select v-model="api.method" slot="prepend" placeholder="请选择">
                    <el-option label="GET" value="get"></el-option>
                    <el-option label="POST" value="post"></el-option>
                    <el-option label="PUT" value="put"></el-option>
                    <el-option label="DELETE" value="delete"></el-option>
                </el-select>
                <el-button slot="append" @click="saveApi()">Save</el-button>
            </el-input>
        </div>
        <request-box></request-box>
        <response-box ref="response"></response-box>
        <confirm></confirm>
    </div>
  </div>
</template>

<script>
import RequestBox from './RequestBox';
import ResponseBox from './ResponseBox';
import Confirm from './Confirm';
export default {
    components: {
        RequestBox,
        ResponseBox,
        Confirm
    },
    data() {
        return {
            api: {
                url: null,
                name: null,
                method: 'get'
            }
        };
    },
    methods: {
        initApi() {},
        saveApi() {
            this.$store.commit('SHOW_CREATE_DIALOG');
            // const a = this.$refs.response.editor.getValue();
            // return JSON.parse(a);
        }
    },
    mounted() {
        this.initApi();
    }
};
</script>
<style>
.api-box {
    margin: 20px;
}
</style>
