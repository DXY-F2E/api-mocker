<template>
    <el-input
        class="search"
        :placeholder="placeholder"
        icon="search"
        :size="size"
        @change="handleQuery"
        v-model="query">
    </el-input>
</template>
<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '请输入条件'
        },
        size: {
            type: String
        }
    },
    data() {
        return {
            query: null
        };
    },
    methods: {
        handleQuery(val) {
            window.console.log(val);
            this.$emit('query', val);
        }
    }
};
</script>
