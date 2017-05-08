<template>
    <div class="params-table">
        <div class="hd">
            <el-row type="flex">
                <el-col class="key">参数名</el-col>
                <el-col class="type">类型</el-col>
                <el-col class="required">是否必填</el-col>
                <el-col class="comment">备注</el-col>
            </el-row>
        </div>
        <div class="bd">
            <params :params="params"></params>
        </div>
    </div>
</template>

<script>
import Params from './Params';
export default {
    components: {
        Params
    },
    props: ['params']
};
</script>
<style>
.params-table {
    width: 100%;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    overflow: hidden;
    max-width: 750px;
}
.params-table .hd {
    background-color: #f8f8f8;
}
.params-table .el-row {
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    margin: -1px 0;
}
.params-table .el-row:hover {
    background-color: #f8f8f8;
}
.params-table .el-col {
    border-right: 1px solid #e6e6e6;
    padding: 8px 15px;
}
.params-table .el-col:last-child {
    border: none;
}
.params-table .comment {
    min-width: 300px;
    max-width: 300px;
}
.params-table .required,
.params-table .type {
    min-width: 100px;
    max-width: 100px;
    text-align: center;
}
</style>
