<template>
<div class="out-box">
    <div class="hd">Response</div>
    <el-row type="flex">
        <el-col class="status">
            <status :response="response"></status>
        </el-col>
        <el-col>
            <schema :schema="activeSchema"></schema>
        </el-col>
    </el-row>
</div>
</template>

<script>
import Schema from '../schema/Index';
import Status from './Status';
export default {
    props: ['response'],
    components: {
        Status,
        Schema
    },
    data() {
        return {
            activeSchema: this.response[0]
        };
    }
};
</script>
<style>
.out-box {
    /*border-left: 1px solid #d1dbe5;*/
    /*border-right: 1px solid #d1dbe5;*/
}
.out-box > .el-row{
    /*height: 300px;*/
}
.out-box .el-col.status {
    position: relative;
    min-width: 100px;
    max-width: 100px;
    height: 100%;
}
.out-box .schema {
    border-left: 1px solid #d1dbe5;
    /*margin-left: -1px;*/
}
</style>
