<template>
    <div class="response-box">
        <div class="hd">Response
            <div class="control" v-if="mode === 'edit'">
                <el-select v-model="template" size="mini" placeholder="模板" @change="setTemplateVal()">
                    <el-option
                      v-for="(val, idx) in templates"
                      :label="'模板' + (idx+1)"
                      key="idx"
                      :value="idx">
                    </el-option>
                </el-select>
                <el-button size="mini" @click="parseEditor()">Parse</el-button>
                <el-tooltip placement="top">
                  <div slot="content">
                      可使用 ${param} ，返回自定义数据
                  </div>
                  <el-button size="mini">Tip</el-button>
                </el-tooltip>
            </div>
        </div>
        <div id="json-editor"></div>
    </div>
</template>

<script>
import * as ace from 'brace';
import 'brace/mode/json';

export default {
    data() {
        return {
            template: null,
            templates: [
                '{"success": true, "params": {}, "info": "获取成功"}',
                '{"success": true, "params": {}, "msg": "获取成功"}',
                '{"success": false, "params": {}, "msg": "数据获取失败"}',
                '{"success": true, "params": {}, "info": "获取成功"}'
            ]
        };
    },
    props: ['params', 'mode'],
    computed: {
        apiId() {
            return this.$store.state.api._id;
        },
        response() {
            return this.$store.state.response;
        }
    },
    watch: {
        apiId() {
            this.setValue();
        },
        response(val) {
            if (this.mode === 'test') {
                this.editor.setValue(JSON.stringify(val, null, '\t'), 1);
            }
        },
        mode(val) {
            if (val === 'edit') {
                this.setValue();
                this.editor.setReadOnly(false);
            } else {
                this.editor.setValue('');
                this.editor.setReadOnly(true);
            }
        }
    },
    methods: {
        setTemplateVal() {
            const dsl = JSON.parse(this.templates[this.template]);
            for (const key in this.params) {
                this.params[key].forEach(p => {
                    if (p.key) {
                        dsl.params[p.key] = `$\{${p.key}}`;
                    }
                });
            }
            this.editor.setValue(JSON.stringify(dsl, null, '\t'), 1);
            this.$store.commit('UPDATE_API_PROPS', ['dsl', dsl]);
            this.$store.commit('UPDATE_DSL_STATUS', true);
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
            const dsl = this.$store.state.api.dsl;
            if (dsl !== undefined) {
                this.editor.setValue(JSON.stringify(dsl, null, '\t'), 1);
            } else {
                this.editor.setValue('');
            }
        },
        initDsl() {
            this.setValue();
            this.$store.commit('UPDATE_DSL_STATUS', true);
            this.editor.getSession().on('change', () => {
                if (this.mode === 'test') {
                    return;
                }
                let dsl = this.editor.getValue();
                try {
                    dsl = JSON.parse(dsl);
                    this.$store.commit('UPDATE_API_PROPS', ['dsl', dsl]);
                    this.$store.commit('UPDATE_DSL_STATUS', true);
                } catch (err) {
                    this.$store.commit('UPDATE_DSL_STATUS', false);
                    return false;
                }
            });
        },
        parseEditor() {
            let dsl = this.editor.getValue();
            try {
                dsl = JSON.parse(dsl);
                this.editor.setValue(JSON.stringify(dsl, null, '\t'), 1);
            } catch (err) {
                this.$message.error('请正确填写JSON');
            }
        }
    },
    mounted() {
        this.editor = ace.edit('json-editor');
        this.editor.getSession().setMode('ace/mode/json');
        this.initDsl();
    }
};
</script>
<style>
.response-box {
    margin-top: 40px;
}
.desc-box .hd,
.response-box .hd {
    text-align: left;
    border-top: 1px solid #D3DCE6;
    border-bottom: 1px solid #D3DCE6;
    line-height: 36px;
    font-size: 16px;
    color: #C0CCDA;
    padding: 8px 0;
    line-height: 22px;
}
.response-box .hd .control {
    float: right;
}
.response-box .hd .control > * {
    margin-left: 10px;
    vertical-align: top;
}
#json-editor {
    height: 300px;
}
.response-box .el-select {
    width: 80px;
}
</style>
