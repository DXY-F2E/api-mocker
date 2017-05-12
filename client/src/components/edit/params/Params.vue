<template>
    <div class="params-box">
        <div v-for="(param, idx) in params" class="param-box" :key="idx">
            <api-param :params="params"
                       :param="param"
                       :name="name"
                       :mode="mode"
                       @change="(data) => update(data, idx)"
                       @addParam="() => addParam(idx)"
                       @deleteParam="() => deleteParam(idx)">
                <params v-if="param.type === 'object' && param.params"
                        :mode="mode"
                        :params="param.params"
                        slot="params"
                        @change="(data) => update(data, idx)"></params>
            </api-param>
        </div>
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
/*.param .el-input__inner:focus,*/
.param .el-input__inner:hover {
    border-color: #EFF2F7;
}
.params-box .param:focus,
.params-box .param:hover {
    box-shadow: 0px 0px 5px 2px #eee;
    z-index: 1;
}
.params-box .el-select .el-input {
    width: 100px;
}
.params-box .config {
    min-width: 200px;
    max-width: 200px;
}
.params-box .comment {
    min-width: 300px;
    max-width: 300px;
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
.params-box .param.set {
    /*padding-left: 72px;*/
}
.params-box .control {
    min-width: 72px;
    max-width: 72px;
    /*position: absolute;
    left: -72px;
    top: 0;*/
}
.params-box .control i {
    color: #ccc;
    line-height: 36px;
    width: 36px;
    cursor: pointer;
    float: left;
    text-align: center;
}
.params-box .control i:hover {
    background-color: #EFF2F7;
}
</style>
