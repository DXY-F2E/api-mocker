<template>
    <el-row type="flex" class="request-box">
        <el-col class="types">
            <div class="control">Types</div>
            <ul>
                <li class="item"
                    v-show="method !== 'get' || r.name !== 'body'"
                    :class="[{active: activeType === r.name}]"
                    v-for="(r, key) in types"
                    :key="key"
                    @click="changeSchema(r.name)">
                    <span>{{r.label}}</span>
                </li>
                <li class="item"
                    :class="[{active: activeType === 'headers'}]"
                    key="headers"
                    @click="changeSchema('headers')">
                    <span>Header</span>
                </li>
            </ul>
        </el-col>
        <el-col class="schema-content">
            <schema :schema="activeSchema"
                    :name="activeType"
                    :fullscreen="fullscreen"
                    @change="updateParams"></schema>
        </el-col>
    </el-row>
</template>

<script>
import Schema from '../schema/Index';
import R from 'ramda';
export default {
    components: {
        Schema
    },
    props: ['fullscreen', 'method'],
    data() {
        return {
            activeType: this.initActive(),
            types: [{
                label: 'Body',
                name: 'body'
            }, {
                label: 'Query',
                name: 'query'
            }, {
                label: 'Path',
                name: 'path'
            }]
        };
    },
    methods: {
        initActive() {
            if (this.method === 'get') {
                return 'query';
            } else {
                return 'body';
            }
        },
        updateParams(data) {
            if (this.activeType === 'headers') {
                this.$store.commit('UPDATE_API_PROPS',
                                   ['options.headers', data]);
                return;
            }
            const key = `options.params.${this.activeType}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [key, data.params]);
            const exampleKey = `options.examples.${this.activeType}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [exampleKey, data.example]);
        },
        changeSchema(type) {
            this.activeType = type;
        },
        getSchemaObject(key) {
            return {
                example: this.examples[key],
                params: this.params[key]
            };
        }
    },
    watch: {
        method(val) {
            if (this.activeType === 'headers') {
                return;
            }
            if (val === 'get') {
                this.activeType = 'query';
            } else {
                this.activeType = 'body';
            }
        }
    },
    computed: {
        activeSchema() {
            return this.activeType === 'headers' ? this.headers : this.localParams[this.activeType];
        },
        headers() {
            return this.$store.state.api.options.headers;
        },
        params() {
            return R.clone(this.$store.state.api.options.params);
        },
        examples() {
            return R.clone(this.$store.state.api.options.examples);
        },
        localParams() {
            const localParams = {};
            for (const key in this.params) {
                localParams[key] = this.getSchemaObject(key);
            }
            return localParams;
        }
    }
};
</script>
<style>
.request-box {
    height: 300px;
}
.request-box .el-col.types {
    position: relative;
    min-width: 150px;
    max-width: 150px;
    height: 100%;
}
.request-box .types .control {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-bottom: 1px solid #d1dbe5;
}
.request-box .types .item {
    border-bottom: 1px solid #eee;
    padding: 8px 10px;
    cursor: pointer;
    opacity: 0.6;
    height: 36px;
    overflow: hidden;
}
.request-box .types .item.active {
    background-color: #fafafa;
    color: #333;
    opacity: 1;
}
</style>
