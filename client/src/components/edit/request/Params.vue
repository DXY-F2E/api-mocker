<template>
    <div class="params-box">
        <div v-for="(param, idx) in params" class="param-box" :key="param">
            <a-param :params="params"
                     :param="param"
                     :reqParam="reqParams[idx]"
                     @addParam="() => addParam(idx)"
                     @deleteParam="() => deleteParam(idx)"
                     @updateParam="updateParam"
                     @updateReqParam="updateReqParam">
                <params v-if="param.type === 'object' && param.params"
                        slot="params"
                        :params="param.params"
                        :name="name"
                        @updateParams="updateParam"
                        @updateReqParams="updateReqParam"></params>
            </a-param>
        </div>
    </div>
</template>

<script>
import AParam from './Param';
export default {
    name: 'params',
    components: {
        AParam
    },
    beforeMount() {
        if (!this.params || this.params.length === 0) {
            this.params.push({
                key: null,
                type: 'string',
                required: true
            });
        }
    },
    props: ['params', 'name'],
    computed: {
        reqParams: {
            get() {
                return this.params;
            }
        }
    },
    methods: {
        getObjectVal() {
            const value = {};
            this.param.params.forEach(p => {
                value[p.key] = p.value;
            });
            return JSON.stringify(value);
        },
        update() {
            this.$emit('updateParams', this.params, this.data);
        },
        updateParam() {
            this.update();
        },
        updateReqParam() {
            window.console.log(this.reqParams);
            if (this.reqParams.type === 'object') {
                this.reqParams.value = this.getObjectVal();
            }
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
/*.params-box .params-box:before {
    content: '';
    position: absolute;
    width: 1px;
    left: 12px;
    top: 4px;
    bottom: 16px;
    background-color: #d1dbe5;
}
.params-box .params-box .param:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 1px;
    background-color: #d1dbe5;
    left: -12px;
    top: 19px;
}*/
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
