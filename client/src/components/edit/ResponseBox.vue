<template>
    <div class="response-box">
        <div class="hd">Response</div>
        <div id="json-editor"></div>
    </div>
</template>

<script>
import * as ace from 'brace';
import 'brace/mode/json';

export default {
    computed: {
        dsl() {
            return this.$store.state.api.dsl;
        }
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
        init() {
            const JsonEditor = ace.edit('json-editor');
            JsonEditor.getSession().setMode('ace/mode/json');
            // this.initDsl();
            this.$store.commit('INIT_EDITOR', JsonEditor);
            window.console.log(JsonEditor);
        },
        initDsl() {
            const dsl = this.$store.state.api.dsl;
            if (dsl !== undefined) {
                this.editor.setValue(JSON.stringify(dsl, null, '\t'));
            }
            // this.editor.getSession().on('change', () => {
            //     this.$store.commit('UPDATE_API_DSL', this.editor.getValue());
            //     // this.dsl = this.editor.getValue();
            // });
        }
    },
    mounted() {
        this.JsonEditor = ace.edit('json-editor');
        this.JsonEditor.getSession().setMode('ace/mode/json');
        // this.initDsl();
        // this.$store.commit('INIT_EDITOR', this.JsonEditor);
        // window.console.log(this.JsonEditor);
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
}
#json-editor {
    height: 300px;
}
</style>
