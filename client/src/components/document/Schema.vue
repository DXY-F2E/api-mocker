<template>
    <div class="schema doc-schema">
        <div class="title" :class="isShowExample">
            <span class="status" v-if="schema.status" :class="schema.status.toString()">{{schema.status}}</span>
            <span class="status-text" v-if="name">{{name}}</span>
            <span v-if="schema.statusText">[{{schema.statusText}}]</span>
            <a href="javascript:;" class="example"
                                   @click="isShowExample = !isShowExample">
                {{isShowExample ? '结构' : '示例' }}
            </a>
        </div>
        <params-table :params="schema.params" v-show="!isShowExample"></params-table>
        <pre class="code" v-show="isShowExample"><code v-html="example"></code></pre>
    </div>
</template>

<script>
import Prism from 'prismjs';
import ParamsTable from './ParamsTable';
import 'prismjs/themes/prism.css';
import { buildExampleFormSchema } from '../../util';
export default {
    props: ['schema', 'name'],
    data() {
        return {
            isShowExample: false
        };
    },
    computed: {
        example() {
            const example = this.schema.example ? this.schema.example : buildExampleFormSchema(this.schema);
            return Prism.highlight(JSON.stringify(example, null, 4), Prism.languages.javascript);
        }
    },
    components: {
        ParamsTable
    }
};
</script>
<style>
.doc-schema {
    margin-bottom: 30px;
    max-width: 917px;
}
.doc-schema .title {
    font-size: 14px;
    border-radius: 3px;
    padding: 0 10px;
    border: 1px solid #eee;
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    background-color: #f8f8f8;
}
.doc-schema .example {
    float: right;
}
.title .status-text {
    font-size: 15px;
}
.title .status {
    color: #333;
}
.title [class^='status 5'],
.title [class^='status 4']{
    color: red;
}
.title [class^='status 3']{
    color: #f5a623;
}
.title [class^='status 2']{
    color: #3eb63e;
}
.title [class^='status 1']{
    color: #aaa;
}
</style>
