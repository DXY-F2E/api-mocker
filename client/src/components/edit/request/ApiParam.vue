<template>
    <div class="param set">
        <el-row type="flex" class="row-bg" >
            <el-col class="key">
                <el-input placeholder="key" v-model="param.key" @change="update"  @keyup.native.enter="addParam"></el-input>
            </el-col>
            <el-col class="config">
                <el-select v-model="apiType" placeholder="类型" @change="changeParamType">
                    <el-option
                        v-for="(type, idx) in tpyeList"
                        :key="type"
                        :label="type"
                        :value="type.toLowerCase()">
                    </el-option>
                </el-select>
                <el-checkbox v-model="param.required" @change="update">必填</el-checkbox>
            </el-col>
            <el-col class="comment">
                <el-input placeholder="备注" v-model="param.comment" @change="update"></el-input>
            </el-col>
            <el-col class="control">
                <i class="el-icon-plus" @click="addParam"></i>
                <i class="el-icon-close"
                   @click="deleteParam"
                   v-if="params.length > 1">
                </i>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        params: {
            type: Array,
            required: true
        },
        param: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            apiType: this.param.type, // Vue + element升级到2.3.x + 1.3.1，select的model在这就不能直接绑定param.type了
            tpyeList: this.getTypeList()
        };
    },
    methods: {
        changeParamType(val) {
            this.param.type = val;
            if (val === 'object') {
                if (!this.param.params) {
                    this.$set(this.param, 'params', [{
                        key: null,
                        type: 'string',
                        required: true
                    }]);
                }
                this.$emit('buildObject', this.param);
            }
            this.update();
        },
        update() {
            this.$emit('change', this.param);
        },
        addParam() {
            this.$emit('addParam');
        },
        deleteParam() {
            this.$emit('deleteParam');
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
.params-box .control {
    min-width: 72px;
    max-width: 72px;
    /*position: absolute;
    left: 0;
    top: 0;*/
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
</style>
