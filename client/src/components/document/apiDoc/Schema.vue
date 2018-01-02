<template>
  <div class="schema doc-schema">
    <div class="title"
         :class="isShowExample"
         v-if="name !== 'headers'">
      <span class="status"
            v-if="schema.status"
            :class="schema.status.toString()">{{schema.status}}</span>
      <span class="status-text"
            v-if="name">{{name}}</span>
      <span v-if="schema.statusText">[{{schema.statusText}}]</span>
      <a href="javascript:;"
         class="example"
         v-if="!diffMode"
         @click="isShowExample = !isShowExample">
        {{isShowExample ? '结构' : '示例' }}
      </a>
    </div>
    <params-table :params="schema.params"
                  v-show="!isShowExample"
                  :diff-mode="diffMode"
                  :diff-stack="diffStack"
                  :diff-path="diffPath"></params-table>
    <pre class="code"
         v-show="isShowExample"><code v-html="example"></code></pre>
  </div>
</template>

<script>
import Prism from 'prismjs'
import ParamsTable from './ParamsTable'
import 'prismjs/themes/prism.css'
import { buildExampleFromSchema } from '@/util'
export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    diffStack: {
      type: Object,
      required: false
    },
    diffPath: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      isShowExample: false
    }
  },
  computed: {
    diffMode () {
      return this.$store.state.diffMode
    },
    example () {
      const example = this.schema.example
        ? this.schema.example
        : buildExampleFromSchema(this.schema)
      return Prism.highlight(
        JSON.stringify(example, null, 4),
        Prism.languages.javascript
      )
    }
  },
  components: {
    ParamsTable
  }
}
</script>
<style lang="less">
.doc-schema {
  margin-bottom: 30px;

  .title {
    font-size: 14px;
    border-radius: 3px;
    padding: 0 10px;
    border: 1px solid #eee;
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    background-color: #f8f8f8;

    .status-text {
      font-size: 15px;
    }
    .status {
      color: #333;
    }
    [class^='status 5'],
    [class^='status 4'] {
      color: red;
    }
    [class^='status 3'] {
      color: #f5a623;
    }
    [class^='status 2'] {
      color: #3eb63e;
    }
    [class^='status 1'] {
      color: #aaa;
    }
  }
  .example {
    float: right;
  }
}
</style>
