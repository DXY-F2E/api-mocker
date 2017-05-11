<template>
    <div class="schema">
        <el-tabs type="card" class="tabs">
            <el-tab-pane class="tab-item" label="Editor">
                <!-- <params :params="params"
                        @updateParams="updateParams"></params> -->
            </el-tab-pane>
            <el-tab-pane class="tab-item" label="JSON Schema">配置管理</el-tab-pane>
            <el-tab-pane class="tab-item" label="Example">角色管理</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    props: {
        schema: {
            type: Object,
            required: true
        }
    },
    methods: {
        updateParams() {
            window.console.log('change params');
        }
    }
};
</script>
<style>
.schema .tabs .el-tabs__item{
    border-top: 0 !important;
    border-radius: 0 !important;
}
.schema .el-tabs__item {
    height: 36px;
    line-height: 36px;
}
.schema .el-tabs__content {
   /* min-height: 200px;
    max-height: 300px;*/
}
</style>
