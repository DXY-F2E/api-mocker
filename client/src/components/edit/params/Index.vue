<template>
    <params :params="params"
            :name="name"
            :mode="mode"
            @change="update"></params>
</template>

<script>
import Params from './Params';
export default {
    components: {
        Params
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
    props: {
        params: {
            type: Array,
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
    methods: {
        getFillValue(params) {
            const value = {};
            params.forEach(p => {
                if (p.type === 'object' && p.params) {
                    const v = this.getFillValue(p.params);
                    if (Object.keys(v).length > 0) {
                        value[p.key] = v;
                        this.$set(p, 'value', v);
                    }
                } else if (p.value) {
                    value[p.key] = p.value;
                }
            });
            return value;
        },
        update() {
            if (this.mode === 'fill') {
                const value = this.getFillValue(this.params);
                this.$emit('updateParams', this.params, value);
            } else {
                this.$emit('updateParams', this.params);
            }
        }
    }
};
</script>
