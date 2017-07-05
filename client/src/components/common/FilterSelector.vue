<template>
<el-select
    class="filter-selector"
    v-model="localValue"
    multiple
    filterable
    remote
    @change="change"
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name"
        :value="item._id">
    </el-option>
</el-select>
</template>

<script>
export default {
    props: {
        remoteMethod: Function,
        placeholder: {
            type: String,
            default: '请输入进行搜索选择'
        },
        loading: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default: []
        },
        options: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            localValue: this.value
        };
    },
    methods: {
        change(val) {
            window.console.log('change');
            this.$emit('change', val);
        }
    }
};
</script>
<style lang="less">
</style>
