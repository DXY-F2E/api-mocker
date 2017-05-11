<template>
    <div class="params-box">
        <div v-for="(param, idx) in params" class="param-box" :key="idx">
            <api-param :params="params"
                       :param="param"
                       @change="updateParam"
                       @buildObject="buildObject"
                       @addParam="addParam"
                       @deleteParam="deleteParam"></api-param>
            <params v-if="param.type === 'object' && param.params"
                    :params="param.params"
                    @updateParams="updateParam"></params>
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
    props: ['params'],
    methods: {
        buildObject() {
            window.console.log(this.params);
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
        }
    }
};
</script>
