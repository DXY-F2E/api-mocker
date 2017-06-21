<template>
    <div class="doc-params">
        <doc-param v-for="(param, key) in params" :key="key" :param="param" :level="level">
            <params v-if="param.type === 'object' && param.params"
                        :params="param.params"
                        :level="nextLevel"
                        slot="params">
            </params>
            <params v-if="param.type === 'array' && param.items.type === 'object'"
                    :params="param.items.params"
                    :level="nextLevel"
                    slot="params"></params>
        </doc-param>
    </div>
</template>

<script>
import DocParam from './Param';
export default {
    name: 'params',
    components: {
        DocParam
    },
    computed: {
        nextLevel() {
            return this.level + 1;
        }
    },
    props: ['params', 'level']
};
</script>
<style type="text/css">
.doc-params {
    position: relative;
}
.doc-param {
    position: relative;
    z-index: 0;
}
.doc-params .doc-params {
    /*margin-left: -20px;*/
    /*padding-left: 20px;*/
}
.doc-params .doc-params .el-col.key {
    /*text-indent: 20px;*/
}
.doc-params .doc-params:before {
    /*content: '';*/
    position: absolute;
    width: 1px;
    left: 20px;
    top: 0px;
    bottom: 0px;
    background-color: #e6e6e6;
    z-index: 1;
}
</style>
