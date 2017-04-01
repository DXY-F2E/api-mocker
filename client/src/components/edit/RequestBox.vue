<template>
    <div class="request-box">
        <el-tabs v-model="requestActive">
            <el-tab-pane label="Params" name="params">
                <params></params>
            </el-tab-pane>
            <el-tab-pane label="Advanced" name="advanced" v-if="mode === 'edit'">
                <advanced></advanced>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Params from './Params';
import ReqBody from './Body';
import Advanced from './Advanced';
export default {
    components: {
        Params,
        Advanced,
        ReqBody
    },
    computed: {
        mode() {
            return this.$store.state.mode;
        }
    },
    watch: {
        mode(val) {
            if (val === 'test') {
                this.requestActive = 'params';
            }
        }
    },
    data() {
        return {
            requestActive: 'params'
        };
    }
};
</script>
<style>
.request-box .el-select .el-input {
    width: 100px;
}
</style>
