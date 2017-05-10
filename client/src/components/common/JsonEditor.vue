<template>
    <div class="json-editor" :class="isFullscreen ? 'fullscreen' : ''">
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
            <el-button size="mini" @click="fullscreen()">{{isFullscreen ? '取消' : ''}}全屏</el-button>
        </div>
        <div :id="id" class="editor-range" @keyup="keyupBehavior"></div>
    </div>
</template>

<script>
import * as ace from 'brace';
import 'brace/mode/json';
import R from 'ramda';

export default {
    data() {
        return {
            isFullscreen: false,
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
        value(newVal) {
            if (!R.equals(newVal, this.getValue())) {
                this.setValue();
            }
        }
    },
    methods: {
        keyupBehavior(e) {
            // 按Esc键退出全屏
            if (this.isFullscreen && e.keyCode === 27) {
                this.fullscreen();
            }
        },
        fullscreen() {
            this.isFullscreen = !this.isFullscreen;
            window.setTimeout(() => {
                this.editor.resize(true);
                this.editor.focus();
            });
        },
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
        getValue() {
            return JSON.parse(this.editor.getValue());
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
                    const data = this.getValue();
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
        this.editor.getSession().setOptions({
            mode: 'ace/mode/json',
            tabSize: 4,
            useSoftTabs: true
        });
        this.editor.setAutoScrollEditorIntoView(true);
        this.initEditor();
    }
};
</script>
<style>
.json-editor {
    position: relative;
    height: 300px;
}
.json-editor.fullscreen {
    position: fixed;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: #fff;
}
.json-editor .toolbar > * {
    vertical-align: top;
}
.json-editor.fullscreen .editor-range {
    height: 100%;
}
.json-editor .editor-range{
    height: 100%;

}
.json-editor .toolbar .el-select {
    width: 80px;
    margin-right: 12px;
}
.json-editor .toolbar {
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 2;
    padding: 10px;
}
</style>
