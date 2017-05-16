<template>
    <div class="params-box">
        <api-param :params="params"
                   :param="param"
                   :name="name"
                   :mode="mode"
                   :level="level"
                   v-for="(param, idx) in params" :key="idx"
                   @change="(data) => update(data, idx)"
                   @addParam="() => addParam(idx)"
                   @deleteParam="() => deleteParam(idx)">
            <params v-if="param.type === 'object' && param.params"
                    :mode="mode"
                    :params="param.params"
                    slot="params"
                    :level="level + 1"
                    @change="(data) => update(data, idx)"></params>
            <params v-if="param.type === 'array' && param.items.type === 'object'"
                    :mode="mode"
                    :params="param.items.params"
                    slot="params"
                    :level="level + 1"
                    @change="(data) => update(data, idx)"></params>
        </api-param>
    </div>
</template>

<script>
import ApiParam from './Param';
export default {
    name: 'params',
    components: {
        ApiParam
    },
    props: {
        level: {
            type: Number,
            required: true
        },
        params: {
            type: Array,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        mode: {
            type: String,
            default: 'set'
        }
    },
    methods: {
        change() {
            this.$emit('change', this.params);
        },
        update(data, idx) {
            if (data.length === undefined) {
                this.$set(this.params, idx, data);
            } else {
                this.$set(this.params[idx], 'params', data);
            }
            this.change();
        },
        addParam(idx) {
            const param = {
                key: null,
                type: 'string',
                required: true
            };
            this.params.splice(idx + 1, 0, param);
            this.change();
        },
        deleteParam(idx) {
            if (this.params.length === 1) {
                return;
            }
            this.params.splice(idx, 1);
            this.change();
        }
    }
};
</script>
<style>
.params-box {
    /*max-width: 750px;*/
    /*background-color: #f5f5f5;*/
    position: relative;
}
.params-box .params-box:before {
    content: '';
    position: absolute;
    width: 1px;
    left: 0px;
    top: 4px;
    bottom: 16px;
    background-color: #d1dbe5;
}
.params-box .params-box .param:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 1px;
    background-color: #d1dbe5;
    left: -25px;
    top: 19px;
}
.params-box .param {
    position: relative;
    z-index: 0;
}
.params-box .el-cascader .el-input {
    width: 140px;
}
.params-box .config {
    min-width: 220px;
    max-width: 220px;
}
.params-box .example {
    min-width: 145px;
    max-width: 220px;
}
.params-box .comment {
    margin-right: 20px;
    min-width: 145px;
    max-width: 240px;
}
.params-box .key {
    min-width: 100px;
}
.params-box .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #EFF2F7;
}
.params-box .el-input-number {
    width: 100%;
}
.params-box .el-select {
    margin-right: 20px;
}
.params-box .fill .name {
    min-width: 140px;
    /*max-width: 300px;*/
    padding-left: 10px;
    margin-right: 10px;
}
.params-box .fill .name label {
    display: block;
    line-height: 36px;
    height: 36px;
    border-bottom: 1px solid #EFF2F7;
}
.params-box code {
    color: #e96900;
    margin: 0 2px;
    border-radius: 2px;
    white-space: nowrap;
}
.params-box .params-box {
    padding-left: 25px;
    position: relative;
}
.params-box.set {
    padding-left: 66px;
}
</style>
