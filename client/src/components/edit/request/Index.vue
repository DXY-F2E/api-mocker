<template>
    <el-row type="flex" class="request-box">
        <el-col class="types">
            <div class="control">Types</div>
            <ul>
                <li class="item"
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
import ParamsBox from './ParamsBox';
import Schema from '../schema/Index';
import R from 'ramda';
export default {
    components: {
        ParamsBox,
        Schema
    },
    props: ['fullscreen'],
    data() {
        return {
            activeType: 'body',
            types: [{
                label: 'Body',
                name: 'body'
            }, {
                label: 'Query',
                name: 'query'
            }]
        };
    },
    methods: {
        updateParams(data) {
            if (this.activeType === 'headers') {
                this.$store.commit('UPDATE_API_PROPS',
                                   ['options.headers', R.clone(data)]);
                return;
            }
            const key = `options.params.${this.activeType}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [key, R.clone(data.params)]);
            const exampleKey = `options.examples.${this.activeType}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [exampleKey, R.clone(data.example)]);
        },
        changeSchema(type) {
            this.activeType = type;
        },
        getSchemaObject(key) {
            return {
                example: R.clone(this.examples[key]),
                params: R.clone(this.params[key])
            };
        }
    },
    computed: {
        activeSchema() {
            return this.activeType === 'headers' ? this.headers : this.localParams[this.activeType];
        },
        headers() {
            return this.$store.state.api.options.headers;
        },
        method() {
            return this.$store.state.api.options.method;
        },
        params() {
            return this.$store.state.api.options.params;
        },
        examples() {
            return this.$store.state.api.options.examples;
        },
        localParams() {
            const localParams = {};
            for (const key in this.params) {
                localParams[key] = this.getSchemaObject(key);
            }
            return localParams;
        },
        requestActive() {
            if (this.method === 'get' || this.method === 'delete') {
                return 'query';
            } else {
                return 'body';
            }
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
