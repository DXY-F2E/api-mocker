<template>
    <el-input
        placeholder="请输入api地址、名称、方法"
        icon="search"
        v-model="query">
    </el-input>
</template>
<script>
export default {
    data() {
        return {
            query: null
        };
    },
    watch: {
        query(val) {
            this.$emit('query', val);
        }
    }
};
</script>
