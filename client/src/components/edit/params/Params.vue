<template>
    <div class="params-box">
        <api-param :params="params"
                   :param="param"
                   :name="name"
                   :level="level"
                   v-for="(param, idx) in params" :key="idx"
                   @change="(data) => update(data, idx)"
                   @addParam="() => addParam(idx)"
                   @deleteParam="() => deleteParam(idx)">
            <params v-if="param.type === 'object' && param.params"
                    :params="param.params"
                    :name="name"
                    slot="params"
                    :level="level + 1"
                    @change="(data) => update(data, idx)"></params>
            <params v-if="param.type === 'array' && param.items.type === 'object'"
                    :params="param.items.params"
                    :name="name"
                    slot="params"
                    :level="level + 1"
                    @change="(data) => update(data, idx)"></params>
        </api-param>
    </div>
</template>

<script>
import ApiParam from './Param';
import { debounce } from '../../../util';
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
        }
    },
    data() {
        return {
            lazyChange: debounce(this.change, 300)
        };
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
            this.lazyChange();
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
