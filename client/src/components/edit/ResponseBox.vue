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
        dsl: {
            get() {
                window.console.log('get dsl value');
                return this.$store.state.api.dsl;
            },
            set(val) {
                window.console.log(val);
            }
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
        initDsl() {
            const dsl = this.$store.state.api.dsl;
            window.console.log(dsl);
            if (dsl !== undefined) {
                this.dsl = JSON.parse(JSON.stringify(dsl));
                this.editor.setValue(JSON.stringify(this.dsl, null, '\t'));
            }
            this.editor.getSession().on('change', () => {
                this.$store.commit('UPDATE_API_DSL', this.editor.getValue());
            });
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
}
#json-editor {
    height: 300px;
}
</style>
