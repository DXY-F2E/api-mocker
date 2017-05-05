<template>
    <div class="params-box">
        <div v-for="(param, idx) in params" class="param-box" :key="param">
            <mock-param :params="params"
                     :param="param"
                     :req-param="reqParams.params[idx]"
                     @addParam="() => addParam(idx)"
                     @deleteParam="() => deleteParam(idx)"
                     @updateParam="updateParam"
                     @updateReqParam="updateReqParam">
                <params v-if="param.type === 'object' && param.params"
                        slot="params"
                        :params="param.params"
                        :req-params="reqParams.params[idx]"
                        :name="name"
                        @updateParams="updateParam"
                        @updateReqParams="updateReqParam"></params>
            </mock-param>
        </div>
    </div>
</template>

<script>
import MockParam from './Param';
export default {
    name: 'params',
    components: {
        MockParam
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
    props: ['params', 'reqParams', 'name'],
    methods: {
        getObjectVal() {
            const value = {};
            this.reqParams.params.forEach(p => {
                if (p.value) {
                    value[p.key] = p.value;
                }
            });
            return value;
        },
        update() {
            this.$emit('updateParams', this.params, this.data);
        },
        updateParam() {
            this.update();
        },
        updateReqParam() {
            if (this.reqParams.type === 'object') {
                this.$set(this.reqParams, 'value', this.getObjectVal());
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
</style>
