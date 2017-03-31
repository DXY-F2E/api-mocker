<template>
    <div class="params-box">
        <el-row type="flex" class="row-bg" v-for="(param, idx) in params" key="idx">
            <el-col class="key">
                <div class="grid-content">
                    <el-input placeholder="key" v-model="param.key"></el-input>
                </div>
            </el-col>
            <el-col class="config">
                <div class="grid-content">
                    <el-select v-model="param.type" placeholder="类型" >
                        <el-option
                            v-for="(type, idx) in typeList"
                            key="idx"
                            :label="type"
                            :value="type">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="param.required">必填</el-checkbox>
                </div>
            </el-col>
            <el-col class="control">
                <div class="grid-content">
                    <i class="el-icon-plus" @click="addParam(idx)"></i>
                    <i class="el-icon-close"
                       @click="deleteParam(idx)"
                       v-if="params.length > 1">
                    </i>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            typeList: ['String', 'Number', 'Object', 'Array'],
            params: this.getInitParams()
        };
    },
    computed: {
        apiId() {
            return this.$store.state.api._id;
        }
    },
    watch: {
        params: {
            handler() {
                this.$store.commit('UPDATE_API_PROPS',
                                   ['options.params', this.getParams()]);
            },
            deep: true
        },
        apiId() {
            this.params = this.getInitParams();
        }
    },
    methods: {
        getParams() {
            const params = JSON.parse(JSON.stringify(this.params));
            params.forEach((v, idx) => {
                if (v.key === null || v.key.trim() === '') {
                    params.splice(idx, 1);
                }
            });
            return params;
        },
        getInitParams() {
            const params = this.$store.state.api.options.params;
            if (params && params.length > 0) {
                return JSON.parse(JSON.stringify(params));
            } else {
                return [{
                    key: null,
                    type: 'String',
                    required: true
                }];
            }
        },
        addParam(idx) {
            const param = {
                key: null,
                type: 'String',
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
.params-box .key {
    max-width: 500px;
}
.params-box .config {
    min-width: 200px;
    max-width: 200px;
}
.params-box .control {
    min-width: 120px;
    max-width: 120px;
}
.params-box .el-col {
    /*padding: 0 10px;*/
}
/*.params-box .key .grid-content {
    border-bottom: 1px solid #EFF2F7;
}*/
.params-box .control .grid-content i {
    color: #ccc;
    line-height: 37px;
    width: 37px;
    cursor: pointer;
    float: left;
    text-align: center;
}
.params-box .control .grid-content i:hover {
    background-color: #EFF2F7;
}
.params-box .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #EFF2F7;
}
.params-box .el-select {
    margin-right: 20px;
}
</style>
