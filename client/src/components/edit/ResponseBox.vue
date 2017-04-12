<template>
    <div class="response-box">
        <div class="hd">Response
            <div class="res" v-if="mode === 'test' && response">
                <em>-</em>
                <el-tabs v-model="resActive" @tab-click="showRes">
                    <el-tab-pane label="Body" name="body"></el-tab-pane>
                    <el-tab-pane label="Headers" name="header"></el-tab-pane>
                    <el-tab-pane label="All-Data" name="all"></el-tab-pane>
                </el-tabs>
            </div>
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
            ],
            resActive: 'body'
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
            if (this.mode === 'test' && val) {
                this.showRes();
            }
        },
        mode(val) {
            if (val === 'edit') {
                this.setValue();
                this.editor.setReadOnly(false);
            } else {
                this.$store.commit('UPDATE_RESPONSE', null);
                this.editor.setValue('');
                this.editor.setReadOnly(true);
            }
        }
    },
    methods: {
        showRes() {
            switch (this.resActive) {
                case 'body':
                    this.showResBody();
                    break;
                case 'header':
                    this.showResHeader();
                    break;
                case 'all':
                    this.showResAll();
                    break;
                default:
                    break;
            }
            this.editor.getSession().setScrollTop(0);
        },
        showResBody() {
            this.editor.setValue(JSON.stringify(this.response.data, null, '\t'), 1);
            this.resActive = 'body';
        },
        showResAll() {
            this.editor.setValue(JSON.stringify(this.response, null, '\t'), 1);
            this.resActive = 'all';
        },
        showResHeader() {
            const headers = Object.assign({
                status: this.response.status,
                statusText: this.response.statusText
            }, this.response.headers);
            this.editor.setValue(JSON.stringify(headers, null, '\t'), 1);
            this.resActive = 'header';
        },
        setTemplateVal() {
            const dsl = JSON.parse(this.templates[this.template]);
            for (const key in this.params) {
                this.params[key].forEach(p => {
                    if (p.key) {
                        const param = p.key.replace(/\./g, '_');
                        dsl.params[param] = `$\{${p.key}}`;
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
    /*padding: 8px 0;*/
    line-height: 40px;
}
.response-box .hd .control {
    float: right;
    padding-top: 9px;
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
.response-box .res {
    display: inline-block;
}
.response-box .res > em {
    /*margin-left: 18px;*/
}
.response-box .res .el-tabs {
    display: inline-block;
    vertical-align: top;
}
.response-box .res .el-tabs .el-tabs__header {
    margin: 0;
    border: none;
}
.response-box .el-tabs__item {
    line-height: 40px;
    height: 40px;
}
.response-box .res > span {
    padding: 0 16px;
    box-sizing: border-box;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    position: relative;
    vertical-align: top;
    cursor: pointer;
}
.response-box .res > span.selected {
    color: #20a0ff;
    border-bottom: 3px solid #20a0ff;
}
</style>
