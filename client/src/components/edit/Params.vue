<template>
    <div class="params-box">
        <el-row type="flex" class="row-bg fill" v-for="(p, idx) in params" key="idx">
            <template v-if="p.key">
                <el-col class="name" :span="5">
                    <label>{{p.key}}<code>[{{p.type}}]</code>:</label>
                </el-col>
                <el-col class="value">
                    <el-input :placeholder="getPlaceholder(p)" v-model="reqParams[p.key]" @change="updateReqParams()"></el-input>
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
                        v-for="(type, idx) in typeList"
                        key="idx"
                        :label="type"
                        :value="type">
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
    data() {
        return {
            typeList: ['String', 'Number', 'Object', 'Array'],
            params: this.getInitParams(),
            reqParams: {}
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
        getPlaceholder(p) {
            return p.required ? '必填' : '选填';
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
.params-box .control i {
    color: #ccc;
    line-height: 36px;
    width: 36px;
    cursor: pointer;
    float: left;
    text-align: center;
}
.params-box .control i:hover {
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
.params-box .fill .name {
    min-width: 140px;
    /*max-width: 300px;*/
    padding-left: 10px;
    line-height: 36px;
}
.test .set,
.edit .fill {
    display: none;
}
.params-box code {
    color: #e96900;
    margin: 0 2px;
    border-radius: 2px;
    white-space: nowrap;
}
</style>
