<template>
    <div class="param-wrap" :class="[expanded ? 'unfold' : 'fold']">
        <div class="expand"
             v-show="param.type === 'object'"
             @click="expandParam">
            <span class="el-tree-node__expand-icon" :class="{expanded: expanded}"></span>
        </div>
        <param-set :params="params"
                   :param="param"
                   :name="name"
                   v-if="mode === 'set'"
                   @buildObject="buildObject"
                   @change="updateParam"
                   @addParam="addParam"
                   @deleteParam="deleteParam"></param-set>
        <param-fill v-if="mode === 'fill'"
                    :param="param"
                    @expand="expandParam"
                    @change="updateParam"></param-fill>
        <slot name="params"></slot>
    </div>
</template>

<script>
import ParamFill from './ParamFill';
import ParamSet from './ParamSet';
export default {
    components: {
        ParamFill,
        ParamSet
    },
    props: {
        params: {
            type: Array,
            required: true
        },
        param: {
            type: Object,
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
    data() {
        return {
            expanded: false
        };
    },
    methods: {
        buildObject() {
            this.expanded = true;
        },
        updateParam() {
            this.$emit('change', this.param);
        },
        addParam() {
            this.$emit('addParam');
        },
        deleteParam() {
            this.$emit('deleteParam');
        },
        expandParam() {
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
</style>
