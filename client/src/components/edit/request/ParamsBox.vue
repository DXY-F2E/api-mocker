<template>
    <params :params="params"
            :req-params="reqParams"
            :name="name"
            @updateParams="changeParams"></params>
</template>

<script>
import Params from '../params/Index';
import { clone } from '../../../util';
export default {
    components: {
        Params
    },
    props: ['params', 'name'],
    methods: {
        changeParams(data) {
            const key = `options.params.${this.name}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [key, clone(data)]);
        },
        changeReqParams(data) {
            this.$store.commit('UPDATE_REQ_PARAMS', {
                type: this.name,
                params: clone(data)
            });
            this.reqParams = clone(data);
        },
        getReqParams(param) {
            this.buildReqParams(param);
            return param;
        },
        buildReqParams(param) {
            if (param.type === 'object' && param.params) {
                param.params.map(p => this.buildReqParams(p));
            }
            param.value = '';
        }
    },
    computed: {
        reqParams: {
            get() {
                const reqParams = {
                    type: 'object',
                    params: clone(this.params)
                };
                return this.getReqParams(reqParams);
            }
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
.test .set,
.edit .fill {
    display: none;
}
.params-box code {
    color: #e96900;
    margin: 0 2px;
    border-radius: 2px;
    white-space: nowrap;
}
</style>
