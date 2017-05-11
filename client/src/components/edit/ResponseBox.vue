<template>
    <div class="response-box">
        <div class="hd">Response
            <div class="res" v-if="mode === 'test' && response">
                <em>-</em>
                <el-tabs v-model="resActive">
                    <el-tab-pane label="Body" name="body"></el-tab-pane>
                    <el-tab-pane label="Headers" name="header"></el-tab-pane>
                    <el-tab-pane label="All-Data" name="all"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <json-editor id="json-editor"
                     v-model="jsonData"
                     name="返回数据"
                     :templates="templates"
                     @change="jsonChanged"></json-editor>
    </div>
</template>

<script>
import JsonEditor from '../common/JsonEditor';

export default {
    components: {
        JsonEditor
    },
    data() {
        return {
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
        jsonData() {
            if (this.mode === 'edit') {
                return this.$store.state.api.dsl;
            } else {
                return this.getResponseData();
            }
        },
        apiId() {
            return this.$store.state.api._id;
        },
        response() {
            return this.$store.state.response;
        }
    },
    methods: {
        getResponseData() {
            if (this.resActive === 'body') {
                return this.response.data;
            } else if (this.resActive === 'header') {
                return Object.assign({
                    status: this.response.status,
                    statusText: this.response.statusText
                }, this.response.headers);
            } else {
                return this.response;
            }
        },
        jsonChanged(rs) {
            if (this.mode !== 'edit') {
                return;
            }
            if (rs.success) {
                this.$store.commit('UPDATE_API_PROPS', ['dsl', rs.data]);
            }
            this.$store.commit('UPDATE_DSL_STATUS', rs);
        },
        setValue() {
            const dsl = this.$store.state.api.dsl;
            if (dsl !== undefined) {
                this.editor.setValue(JSON.stringify(dsl, null, '\t'), 1);
            } else {
                this.editor.setValue('');
            }
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
