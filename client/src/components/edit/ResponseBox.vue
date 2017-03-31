<template>
    <div class="response-box">
        <div class="hd">Response
            <el-tooltip placement="top">
              <div slot="content">
                  可使用 ${param} ，返回自定义数据
              </div>
              <el-button size="mini">Tip</el-button>
            </el-tooltip>
            <el-button size="mini" @click="parseEditor()">Parse</el-button>
        </div>
        <div id="json-editor"></div>
    </div>
</template>

<script>
import * as ace from 'brace';
import 'brace/mode/json';

export default {
    computed: {
        apiId() {
            return this.$store.state.api._id;
        },
        params() {
            return this.$store.state.api.params;
        }
    },
    watch: {
        apiId() {
            this.setValue();
        }
    },
    beforeDestory() {
        window.console.log('destory');
    },
    methods: {
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
            this.editor.getSession().on('change', () => {
                let dsl = this.editor.getValue();
                try {
                    dsl = JSON.parse(dsl);
                    window.console.log('更新DSL');
                    this.$store.commit('UPDATE_API_DSL', dsl);
                } catch (err) {
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
.response-box .hd button {
    float: right;
    margin-right: 10px;
}
#json-editor {
    height: 300px;
}
</style>
