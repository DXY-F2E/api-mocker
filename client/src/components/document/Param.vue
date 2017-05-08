<template>
    <div class="doc-param">
        <el-row type="flex">
            <el-col class="key">{{param.key}}</el-col>
            <el-col class="type">{{param.type}}</el-col>
            <el-col class="required">{{param.required ? '是' : '否'}}</el-col>
            <el-col class="comment">{{param.comment ? param.comment : '无'}}</el-col>
        </el-row>
        <slot name="params"></slot>
    </div>
</template>

<script>
export default {
    name: 'docParam',
    props: ['param']
};
</script>
<style>
</style>
