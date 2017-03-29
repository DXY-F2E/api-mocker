<template>
    <div class="request-box">
        <el-tabs v-model="requestActive">
            <el-tab-pane label="Params" name="params">
                <params></params>
            </el-tab-pane>
            <!-- <el-tab-pane label="Body" name="body">
                <req-body></req-body>
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
import Params from './Params';
import ReqBody from './Body';
export default {
    components: {
        Params,
        ReqBody
    },
    data() {
        return {
            requestActive: 'params'
        };
    }
};
</script>
<style>
.request-box {
    margin-top: 20px;
}
.request-box .el-select .el-input {
    width: 100px;
}
</style>
