<template>
<div class="out-box">
    <div class="hd">Response</div>
    <el-row type="flex">
        <el-col class="status">
            <status></status>
        </el-col>
        <el-col>
            <schema v-for="(schema, key) in response" :key="key" :schema="schema"></schema>
        </el-col>
    </el-row>
</div>
</template>

<script>
import Schema from '../schema/Index';
import Status from './Status';
export default {
    components: {
        Status,
        Schema
    },
    computed: {
        response: this.$store.state.api.options.response
    }
};
</script>
<style>
.out-box > .el-row{
    /*height: 300px;*/
}
.out-box .el-col.status {
    position: relative;
    min-width: 100px;
    max-width: 100px;
    height: 100%;
    border-right: 1px solid #d1dbe5;
    margin-right: -1px;
}
</style>
