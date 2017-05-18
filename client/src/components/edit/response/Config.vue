<template>
<div class="config-box">
    <el-form label-position="right" label-width="82px">
        <el-form-item label="返回结果：" class="delay">
            <el-select v-model="responseIndex" placeholder="请选择">
                <el-option
                  v-for="(r, key) in response"
                  :key="key"
                  :label="r.statusText"
                  :value="key">
                </el-option>
                <el-option
                  :key="-1"
                  label="随机"
                  :value="-1">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="模拟延迟：" class="delay">
            <el-input v-model="delay" @change="updateDelay"></el-input>
            <em class="unit">ms</em>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
export default {
    computed: {
        response() {
            return this.$store.state.api.options.response;
        },
        delay() {
            return this.$store.state.api.options.delay;
        },
        responseIndex: {
            get() {
                return this.$store.state.api.options.responseIndex;
            },
            set(value) {
                this.$store.commit('UPDATE_API_PROPS', ['options.responseIndex', value]);
            }
        }
    },
    methods: {
        updateDelay(value) {
            value = window.parseInt(value);
            if (isNaN(value)) {
                value = 0;
            }
            this.$store.commit('UPDATE_API_PROPS', ['options.delay', value]);
        }
    }
};
</script>
<style>
.config-box {
    display: inline-block;
    margin-left: 36px;
    /*padding: 10px 0;*/
    /*border-bottom: 1px solid #D3DCE6;*/
    /*padding-left: 15px;*/
    /*border-left: 1px solid #d3dce6;*/
}
.fullscreen .config-box {
    /*padding: 10px 10px;*/
}
.config-box .el-input {
    display: inline-block;
    width: 70px;
}
.config-box .el-select .el-input {
    width: 100px;
}
.config-box .el-input .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #bfcbd9;
    height: 20px;
}
.config-box .unit {
    color: #bfcbd9;
}
.config-box .delay.el-form-item {
    margin: 0 20px 0 0;
    display: inline-block;
}
</style>
