<template>
    <div class="api-doc" :id="api._id">
        <div class="fields">
            <div class="field name">
                <h2>{{api.name}}<span class="method" :class="method">{{method}}</span></h2>
                <el-button type="primary" class="edit" icon="edit" @click="edit()">编辑</el-button>
            </div>
            <div class="field url">
                <div>
                    <label>测试地址：</label>
                    <p class="prod code">{{url}}</p>
                </div>
                <div v-if="api.prodUrl">
                    <label>线上地址：</label>
                    <p class="prod code">{{api.prodUrl}}</p>
                </div>
            </div>
            <div class="field params" v-for="(ps, name) in params" v-if="ps.length">
                <label>参数列表：{{name}}</label>
                <params-table :params="ps"></params-table>
            </div>
            <div class="field response">
                <label>返回数据</label>
                <response :response="api.dsl"></response>
            </div>
            <div class="field desc" v-show="api.desc">
                <label>其他备注</label>
                <div class="editor-style" v-html="api.desc"></div>
            </div>
        </div>
    </div>
</template>

<script>
import ParamsTable from './ParamsTable';
import Response from './Response';
import CopyButton from '../common/CopyButton';
export default {
    components: {
        CopyButton,
        ParamsTable,
        Response
    },
    props: {
        api: {
            type: Object,
            required: true
        }
    },
    methods: {
        edit() {
            this.$store.commit('UPDATE_API', this.api);
            this.$store.commit('CHANGE_MODE', 'edit');
            this.$router.push(`/edit/${this.api.group}/${this.api._id}`);
        }
    },
    computed: {
        url() {
            return this.$store.state.serverRoot + this.api.url;
        },
        method() {
            return this.api.options.method.toUpperCase();
        },
        params() {
            return this.api.options.params;
        },
        body() {
            return this.api.options.params.body;
        },
        path() {
            return this.api.options.params.path;
        },
        query() {
            return this.api.options.params.query;
        }
    }
};
</script>
<style>
.apis-doc {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.api-doc {
    width: 100%;
    padding: 30px;
}
.api-doc ~ .api-doc {
    border-top: 1px solid #ddd;
}
.api-doc h2 {
    border-bottom: 1px solid #ececec;
    font-weight: bold;
    padding: 10px 0;
}
.api-doc .code {
    border: 1px solid #e6e6e6;
    padding: 6px 10px;
    border-radius: 3px;
    color: #666;
    background-color: #f8f8f8;
}
.api-doc .fields {
    width: 100%;
    min-width: 650px;
    /*max-width: 750px;*/
    /*margin: 0 auto;*/
}
.api-doc .field {
    width: 100%;
    position: relative;
    margin-bottom: 30px;
}
.api-doc .field.name .edit{
    position: absolute;
    right: 0px;
    top: 0;
}
.api-doc .field:last-child {
    margin-bottom: 0;
}
.api-doc .method {
    color: #3eb63e;
    font-weight: normal;
    margin-left: 10px;
}
.method.post,
.method.POST {
    color: #f5a623;
}
.method.get,
.method.GET {
    color: #3eb63e;
}
.api-doc .field.url > div {
    padding-left: 70px;
    position: relative;
    margin-bottom: 10px;
    max-width: 750px;
}
.api-doc .field.url label {
    position: absolute;
    left: 0;
    top: 10px;
}
.api-doc .field > label {
    display: block;
    font-size: 16px;
    border-bottom: 1px solid #e6e6e6;
    line-height: 2;
    margin-bottom: 20px;
}
</style>
