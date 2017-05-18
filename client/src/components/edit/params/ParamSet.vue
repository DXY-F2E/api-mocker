<template>
    <div class="param set">
        <el-row type="flex" class="row-bg" >
            <el-col class="key">
                <el-input placeholder="key" v-model="param.key" @change="update"  @keyup.native.enter="addParam"></el-input>
            </el-col>
            <el-col class="config">
                <el-cascader
                    popper-class="type-cascader"
                    @change="changeParamType"
                    :options="tpyeList"
                    v-model="apiType">
                </el-cascader>
                <el-checkbox v-model="param.required" @change="update">必填</el-checkbox>
            </el-col>
            <el-col class="comment">
                <el-input placeholder="备注" v-model="param.comment" @change="update"></el-input>
            </el-col>
            <el-col class="example">
                <el-input placeholder="example" v-model="example" @change="update"></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        param: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: false
        }
    },
    computed: {
        example: {
            get() {
                return typeof this.param.example === 'string' ? this.param.example : JSON.stringify(this.param.example);
            },
            set(value) {
                try {
                    this.param.example = JSON.parse(value);
                } catch (err) {
                    this.param.example = value;
                }
            }
        },
        apiType() {
            const type = [this.param.type];
            if (this.param.type === 'array') {
                type.push(this.param.items.type);
            }
            return type;
        },
        tpyeList() {
            return this.getTypeList();
        }
    },
    data() {
        return {
            selectedOptions: []
        };
    },
    methods: {
        changeParamType(val) {
            this.$set(this.param, 'type', val[0]);
            if (val[0] === 'object') {
                if (!this.param.params) {
                    this.$set(this.param, 'params', [{
                        key: null,
                        type: 'string',
                        required: true
                    }]);
                }
                this.$emit('buildObject', this.param);
            } else if (val[0] === 'array') {
                this.setArrayType(val[1]);
            }
            this.update();
        },
        setArrayType(type) {
            this.$set(this.param, 'items', {
                type
            });
            if (type === 'object' && !this.param.items.params) {
                this.$set(this.param.items, 'params', [{
                    key: null,
                    type: 'string',
                    required: true
                }]);
                this.$emit('buildObject', this.param);
            }
        },
        update() {
            this.$emit('change', this.param);
        },
        getDefaultType() {
            const type = [this.param.type];
            if (this.param.type === 'array') {
                type.push(this.param.items.type);
            }
            return type;
        },
        getTypeList() {
            if (this.name === 'query') {
                return [{
                    value: 'string',
                    label: 'String'
                }];
            } else {
                const types = ['String', 'Number', 'Boolean', 'Object', 'Array'];
                return types.map(t => {
                    const type = {
                        value: t.toLowerCase(),
                        label: t
                    };
                    if (t === 'Array') {
                        type.children = ['String', 'Number', 'Boolean', 'Object'].map(t => ({
                            value: t.toLowerCase(),
                            label: t
                        }));
                    }
                    return type;
                });
            }
        }
    }
};
</script>
<style type="text/css">
.type-cascader .el-cascader-menu {
    height: auto;
}
</style>
