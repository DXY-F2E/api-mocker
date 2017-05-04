<template>
    <div class="param-wrap" :class="[expanded ? 'unfold' : 'fold']">
        <div class="expand"
             v-show="param.type === 'object'"
             @click="expandParam()">
            <span class="el-tree-node__expand-icon" :class="{expanded: expanded}"></span>
        </div>
        <api-param :params="params"
                   :param="param"
                   :type="name"
                   @change="updateParam"
                   @buildObject="buildObject"
                   @addParam="addParam"
                   @deleteParam="deleteParam"></api-param>
        <req-param v-if="reqParam.key"
                   :param="reqParam"
                   @expand="expandParam"
                   @change="updateReqParam"></req-param>
        <slot name="params"></slot>
    </div>
</template>

<script>
import ApiParam from './ApiParam';
import ReqParam from './ReqParam';
export default {
    components: {
        ApiParam,
        ReqParam
    },
    data() {
        return {
            expanded: false
        };
    },
    props: ['params', 'param', 'reqParam', 'name'],
    methods: {
        buildObject() {
            this.expanded = true;
        },
        getParamsBox() {
            this.$el.childNodes.forEach(child => {
                if (child.className === 'params-box') {
                    this.paramsBox = child;
                }
            });
            return this.paramsBox;
        },
        updateParam() {
            this.$emit('updateParam', this.param);
        },
        updateReqParam() {
            window.console.log('updateReqParam');
            window.console.log(this.reqParam.key);
            this.$emit('updateReqParam', this.reqParam);
        },
        addParam() {
            this.$emit('addParam');
        },
        deleteParam() {
            this.$emit('deleteParam');
        },
        expandParam() {
            this.getParamsBox();
            if (this.expanded) {
                this.paramsBox.style.height = `${this.paramsBox.scrollHeight}px`;
                window.setTimeout(() => {
                    this.paramsBox.style.height = '0px';
                });
            } else {
                this.paramsBox.style.height = `${this.paramsBox.scrollHeight}px`;
                window.setTimeout(() => {
                    this.paramsBox.style.height = 'auto';
                }, 300);
            }
            this.expanded = !this.expanded;
        }
    }
};
</script>
<style>
.param-wrap {
    position: relative;
}
.param-wrap .params-box {
    transition: height 0.3s ease;
}
.param-wrap.fold .params-box {
    overflow: hidden;
    height: 0px;
}
.param-wrap .expand {
    cursor: pointer;
    display: inline-block;
    width: 20px;
    height: 36px;
    position: absolute;
    left: -20px;
    top: 0px;
    line-height: 36px;
}
.params-box .params-box {
    padding-left: 25px;
    position: relative;
}
</style>
