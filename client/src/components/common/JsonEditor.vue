<template>
    <div class="json-editor">
        <div class="toolbar">
            <el-select v-if="templates" v-model="template" size="mini" placeholder="模板" @change="setTemplateVal()">
                <el-option
                  v-for="(val, idx) in templates"
                  :label="'模板' + (idx+1)"
                  key="idx"
                  :value="idx">
                </el-option>
            </el-select>
            <el-button size="mini" @click="parseEditor()">Parse</el-button>
            <el-button size="mini" @click="fullscreen = true">全屏</el-button>
        </div>
        <div :id="id" class="editor-range"></div>
    </div>
</template>

<script>
import * as ace from 'brace';
import 'brace/mode/json';
import R from 'ramda';

export default {
    data() {
        return {
            fullscreen: false,
            template: null
        };
    },
    props: {
        templates: {
            type: Array
        },
        id: {
            type: String,
            default() {
                const random = Math.ceil(Math.random() * 1000000);
                return `jsonEditorId_${random}`;
            }
        },
        value: {
            type: Object
        },
        name: {
            type: String,
            default: 'Json'
        }
    },
    watch: {
        value(newVal, oldVal) {
            if (!R.equals(newVal, oldVal)) {
                this.setValue();
            }
        }
    },
    methods: {
        setTemplateVal() {
            const data = JSON.parse(this.templates[this.template]);
            this.editor.setValue(JSON.stringify(data, null, '\t'), 1);
        },
        validate() {
            try {
                JSON.parse(this.editor.getValue());
                return true;
            } catch (err) {
                this.$message.error('response 未正确填写');
                return false;
            }
        },
        setValue() {
            if (this.value !== undefined) {
                this.editor.setValue(JSON.stringify(this.value, null, '\t'), 1);
            } else {
                this.editor.setValue('');
            }
        },
        parseEditor() {
            let value = this.editor.getValue();
            try {
                value = JSON.parse(value);
                this.editor.setValue(JSON.stringify(value, null, '\t'), 1);
            } catch (err) {
                this.$message.error('请正确填写JSON');
            }
        },
        initEditor() {
            this.setValue();
            this.editor.getSession().on('change', () => {
                try {
                    const data = JSON.parse(this.editor.getValue());
                    if (Object.keys(data).length > 0) {
                        this.$emit('change', data, {
                            success: true,
                            msg: ''
                        });
                    } else {
                        this.$emit('change', false, {
                            success: false,
                            msg: `${this.name}空对象`
                        });
                    }
                } catch (err) {
                    this.$emit('change', false, {
                        success: false,
                        msg: `${this.name}格式错误`
                    });
                }
            });
        }
    },
    mounted() {
        this.editor = ace.edit(this.id);
        this.editor.getSession().setMode('ace/mode/json');
        this.initEditor();
    }
};
</script>
<style>
.json-editor {
    position: relative;
}
.json-editor .toolbar > * {
    vertical-align: top;
}
.json-editor .editor-range{
    height: 300px;
}
.json-editor .toolbar .el-select {
    width: 80px;
    margin-right: 12px;
}
.json-editor .toolbar {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    padding: 10px;
}
</style>
