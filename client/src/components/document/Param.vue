<template>
    <div class="doc-param" v-if="param.key">
        <el-row type="flex">
            <el-col class="key">{{param.key}}</el-col>
            <el-col class="type">{{param.type}}<code class="array-type" v-if="param.type === 'array'">[{{param.items.type}}]</code></el-col>
            <el-col class="required">{{param.required ? '是' : '否'}}</el-col>
            <el-col class="comment">{{param.comment ? param.comment : '无'}}</el-col>
            <el-col class="example">{{param.example ? param.example : '无'}}</el-col>
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
.doc-param .array-type {
    color: #e96900;
}
</style>
