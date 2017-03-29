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
        apiId() {
            return this.$store.state.api._id;
        }
    },
    watch: {
        apiId() {
            this.setValue();
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
        setValue() {
            const dsl = this.$store.state.api.dsl;
            if (dsl !== undefined) {
                this.editor.setValue(JSON.stringify(dsl, null, '\t'));
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
