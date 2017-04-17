<template>
    <div class="params-box">
        <el-row type="flex" class="row-bg fill" v-for="(p, idx) in reqParams" key="idx">
            <template v-if="p.key">
                <el-col class="name" :span="5">
                    <label>{{p.key}}<code>[{{p.type}}]</code>:</label>
                </el-col>
                <el-col class="value">
                    <!-- <input type="number" class="el-input__inner"
                                         :placeholder="getPlaceholder(p)"
                                         v-model="reqParams[p.key]"
                                         v-if="p.type === 'Number'"
                                         @input="updateNumberValue(p.value)" /> -->
                    <el-input :placeholder="getPlaceholder(p)" v-model="p.value" @change="updateReqParams"></el-input>
                </el-col>
            </template>
        </el-row>
        <el-row type="flex" class="row-bg set" v-for="(param, idx) in params" key="idx">
            <el-col class="key">
                <el-input placeholder="key" v-model="param.key"></el-input>
            </el-col>
            <el-col class="config">
                <el-select v-model="param.type" placeholder="类型" >
                    <el-option
                        v-for="(type, idx) in tpyeList"
                        key="idx"
                        :label="type"
                        :value="type.toLowerCase()">
                    </el-option>
                </el-select>
                <el-checkbox v-model="param.required">必填</el-checkbox>
            </el-col>
            <el-col class="control">
                <i class="el-icon-plus" @click="addParam(idx)"></i>
                <i class="el-icon-close"
                   @click="deleteParam(idx)"
                   v-if="params.length > 1">
                </i>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: ['data', 'name'],
    data() {
        return {
            tpyeList: this.getTypeList(),
            params: this.getInitParams()
        };
    },
    computed: {
        apiId() {
            return this.$store.state.api._id;
        },
        method() {
            return this.$store.state.api.options.method;
        },
        reqParams: {
            get() {
                return this.params;
            }
        }
    },
    watch: {
        params: {
            handler() {
                const key = `options.params.${this.name}`;
                this.$store.commit('UPDATE_API_PROPS',
                                   [key, this.getParams()]);
            },
            deep: true
        },
        apiId() {
            this.params = this.getInitParams();
        }
    },
    methods: {
        getTypeList() {
            if (this.name === 'query') {
                return ['String'];
            } else {
                return ['String', 'Number', 'Object', 'Array'];
            }
        },
        getInitParams() {
            if (this.data && this.data.length > 0) {
                return JSON.parse(JSON.stringify(this.data));
            } else {
                return [{
                    key: null,
                    type: 'string',
                    required: true
                }];
            }
        },
        getPlaceholder(p) {
            return p.required ? '必填' : '选填';
        },
        updateNumberValue(key) {
            this.reqParams[key] = window.parseInt(this.reqParams[key]);
            this.updateReqParams();
        },
        updateReqParams() {
            this.$store.commit('UPDATE_REQ_PARAMS', {
                type: this.name,
                params: this.reqParams
            });
        },
        getParams() {
            const params = JSON.parse(JSON.stringify(this.params));
            params.forEach((v, idx) => {
                if (v.key === null || v.key.trim() === '') {
                    params.splice(idx, 1);
                }
            });
            return params;
        },
        addParam(idx) {
            const param = {
                key: null,
                type: 'string',
                required: true
            };
            this.params.splice(idx + 1, 0, param);
        },
        deleteParam(idx) {
            if (this.params.length === 1) {
                return;
            }
            this.params.splice(idx, 1);
        }
    }
};
</script>
<style>
</style>
