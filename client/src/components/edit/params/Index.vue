<template>
    <div class="params-box">
        <div v-for="(param, idx) in params" class="param-box" :key="idx">
            <div class="param-wrap" :class="[expanded ? 'unfold' : 'fold']">
                <div class="expand"
                     v-show="param.type === 'object'"
                     @click="expandParam">
                    <span class="el-tree-node__expand-icon" :class="{expanded: expanded}"></span>
                </div>
                <api-param :params="params"
                           :param="param"
                           @change="updateParam"
                           @buildObject="buildObject"
                           @addParam="() => addParam(idx)"
                           @deleteParam="() => deleteParam(idx)"></api-param>
                <params v-if="param.type === 'object' && param.params"
                        :params="param.params"
                        @updateParams="updateParam"></params>
            </div>
        </div>
    </div>
</template>

<script>
import ApiParam from '../request/ApiParam';
export default {
    name: 'params',
    components: {
        ApiParam
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
    data() {
        return {
            expanded: false
        };
    },
    props: ['params'],
    methods: {
        buildObject() {
            this.expanded = true;
        },
        update() {
            this.$emit('updateParams', this.params, this.data);
        },
        updateParam() {
            this.update();
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
        },
        getParamsBox() {
            this.$el.childNodes.forEach(child => {
                if (child.className === 'params-box') {
                    this.paramsBox = child;
                }
            });
            return this.paramsBox;
        },
        expandParam() {
            this.expanded = !this.expanded;
        }
    }
};
</script><style>
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
