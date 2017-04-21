<template>
    <el-input
        class="search"
        :placeholder="placeholder"
        icon="search"
        :size="size"
        @change="handleQuery"
        v-model="inputValue">
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
        },
        value: {
            type: String
        }
    },
    data() {
        return {
            inputValue: this.value
        };
    },
    methods: {
        handleQuery(val) {
            this.$emit('query', val);
        }
    }
};
</script>
