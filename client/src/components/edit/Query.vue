<template>
    <div class="params-box">
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
    props: ['data'],
    data() {
        return {
            tpyeList: ['String'],
            reqParams: {},
            params: this.getInitParams()
        };
    },
    computed: {
        apiId() {
            return this.$store.state.api._id;
        },
        method() {
            return this.$store.state.api.options.method;
        }
    },
    watch: {
        params: {
            handler() {
                this.$store.commit('UPDATE_API_PROPS',
                                   ['options.params.query', this.getParams()]);
            },
            deep: true
        }
    },
    methods: {
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
            this.$store.commit('UPDATE_REQ_PARAMS', this.reqParams);
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
