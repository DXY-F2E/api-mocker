<template>
    <div class="advanced-box">
        <el-form label-position="right" label-width="70px">
            <el-form-item label="延迟：" class="delay">
                <!-- <el-input-number v-model="delay" @change="updateDelay" size="small" :min="0" :max="5000" :step="500" ></el-input-number> -->
                <el-input v-model="delay" @change="updateDelay"></el-input>
                <em class="unit">ms</em>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    computed: {
        delay() {
            return this.$store.state.api.options.delay;
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
.advanced-box .el-input {
    display: inline-block;
    width: 70px;
}
.advanced-box .el-input .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #bfcbd9;
    height: 20px;
}
.advanced-box .unit {
    color: #bfcbd9;
}
.advanced-box .delay.el-form-item {
    margin: 1px 0 0px 0;
}
</style>
