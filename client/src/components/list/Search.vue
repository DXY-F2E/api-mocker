<template>
    <el-input
        placeholder="请输入api地址、创建人邮箱进行搜索"
        icon="search"
        v-model="query"
        :on-icon-click="handleIconClick">
    </el-input>
</template>
<script>
export default {
    data() {
        return {
            query: null
        };
    },
    methods: {
        handleIconClick(ev) {
            window.console.log(ev);
        }
    }
};
</script>
