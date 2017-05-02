<template>
    <div class="param set">
        <el-row type="flex" class="row-bg" >
            <el-col class="key">
                <el-input placeholder="key" v-model="param.key" @change="update"></el-input>
            </el-col>
            <el-col class="config">
                <el-select v-model="param.type" placeholder="类型" @change="changeParamType">
                    <el-option
                        v-for="(type, idx) in tpyeList"
                        key="idx"
                        :label="type"
                        :value="type.toLowerCase()">
                    </el-option>
                </el-select>
                <el-checkbox v-model="param.required" @change="update">必填</el-checkbox>
            </el-col>
            <el-col class="control">
                <i class="el-icon-plus" @click="addParam()"></i>
                <i class="el-icon-close"
                   @click="deleteParam()"
                   v-if="params.length > 1">
                </i>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: ['params', 'param', 'type'],
    data() {
        return {
            tpyeList: this.getTypeList()
        };
    },
    mounted() {
        this.index = this.params.findIndex(p => p === this.param);
    },
    methods: {
        changeParamType(val) {
            if (val === 'object') {
                window.console.log('changeParamType');
                window.console.log(this.param);
                this.param.params = [{
                    key: null,
                    type: 'string',
                    required: true
                }];
            }
            this.update();
        },
        update() {
            this.$emit('change', this.param, this.index);
        },
        getIndex() {
            return this.params.findIndex(p => p === this.param);
        },
        addParam() {
            this.$emit('addParam', this.index);
        },
        deleteParam() {
            this.$emit('deleteParam', this.index);
        },
        getTypeList() {
            if (this.type === 'query') {
                return ['String'];
            } else {
                return ['String', 'Number', 'Object', 'Array'];
            }
        }
    }
};
</script>
<style>
</style>
