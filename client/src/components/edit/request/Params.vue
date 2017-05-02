<template>
    <div class="params-box">
        <div v-for="(param, idx) in params" class="param-wrap">
            <api-param :params="params"
                       :param="param"
                       :type="name"
                       @change="updateParam"
                       @addParam="addParam"
                       @deleteParam="deleteParam"></api-param>
            <req-param v-if="reqParams[idx].key"
                       :param="reqParams[idx]"
                       @change="updateReqParam"></req-param>
            <template v-if="param.type === 'object'">
                <params :data="param.params"
                        :name="name"
                        @updateParams="updateParam"
                        @updateReqParams="updateParam"></params>
            </template>
        </div>
    </div>
</template>

<script>
import ApiParam from './ApiParam';
import ReqParam from './ReqParam';
export default {
    name: 'params',
    components: {
        ApiParam,
        ReqParam
    },
    props: ['data', 'name', 'index'],
    computed: {
        params() {
            // if (this.data && this.data.length > 0) {
            //     return this.data;
            // } else {
            //     return [{
            //         key: null,
            //         type: 'string',
            //         required: true
            //     }];
            // }
            return this.data;
        },
        reqParams: {
            get() {
                return this.params;
            }
        }
    },
    methods: {
        update() {
            this.$emit('updateParams', this.params, this.data);
        },
        updateParam() {
            // 传递给子组件的prop是个数组，会影响父组件数据，不需再设置
            this.update();
        },
        updateReqParam() {
            this.$emit('updateReqParams', this.reqParams);
        },
        addParam(idx) {
            const param = {
                key: null,
                type: 'string',
                required: true
            };
            this.params.splice(idx + 1, 0, param);
            this.update();
        },
        deleteParam(idx) {
            if (this.params.length === 1) {
                return;
            }
            this.params.splice(idx, 1);
            this.update();
        }
    }
};
</script>
<style>
.params-box {
    max-width: 750px;
    position: relative;
}
.params-box .params-box {
    padding-left: 25px;
}
.params-box .param {
    position: relative;
    z-index: 0;
}
.param .el-input__inner:focus,
.param .el-input__inner:hover {
    border-color: #EFF2F7;
}
.params-box .param:focus,
.params-box .param:hover {
    box-shadow: 0px 0px 5px 2px #eee;
    z-index: 1;
}
.params-box .params-box .param:before {
    content: '↳';
    position: absolute;
    left: -15px;
    top: 13px;
}
.params-box .el-select .el-input {
    width: 100px;
}
.params-box .config {
    min-width: 200px;
    max-width: 200px;
}
.params-box .control {
    min-width: 72px;
    max-width: 72px;
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
