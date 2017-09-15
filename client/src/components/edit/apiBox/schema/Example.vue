<template>
  <div class="schema-example">
    <div class="control">
      <el-tooltip class="item"
                  effect="dark"
                  content="已覆盖示例值"
                  placement="top"
                  v-model="tooltip.example"
                  :manual="true">
        <el-button size="small" @click.natvie="buildExample">Schema => Example</el-button>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="生成模型成功"
                  placement="top"
                  v-model="tooltip.schema"
                  :manual="true">
        <el-button size="small" @click.natvie="buildSchema">Example => Schema</el-button>
      </el-tooltip>
    </div>
    <div class="editor">
      <json-editor class="example-editor"
                   v-model="example"
                   :parse-tool="true"
                   :resize-act="fullscreen"
                   :fullscreen-tool="false"
                   @change="updateExample"></json-editor>
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/common/jsonEditor/Index'
import { buildSchemaFromExample, buildExampleFromSchema } from '@/util'
export default {
  components: {
    JsonEditor
  },
  data () {
    return {
      status: {
        success: true,
        msg: ''
      },
      tooltip: {
        example: false,
        schema: false
      }
    }
  },
  computed: {
    example: {
      get () {
        return this.schema.example
      },
      set (val) {
        this.$emit('buildExample', val)
      }
    }
  },
  methods: {
    showTooltip (name) {
      this.tooltip[name] = true
      window.setTimeout(() => {
        this.tooltip[name] = false
      }, 1000)
    },
    updateExample (data) {
      this.status = data
      if (data.success) {
        this.example = data.data
      }
      // 此处为了业务简单，与vuex耦合
      this.$store.commit('UPDATE_DSL_STATUS', data)
    },
    buildExample () {
      this.example = buildExampleFromSchema({
        ...this.schema,
        example: null
      })
      this.showTooltip('example')
    },
    buildSchema () {
      if (!this.status.success) {
        this.$message.error(this.status.msg)
        return
      }
      const schema = buildSchemaFromExample(this.example, this.schema.params)
      this.$emit('buildSchema', schema)
      this.showTooltip('schema')
    }
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style>
.schema-example {
  height: 100%;
}
.schema-example .control {
  padding: 10px 20px;
  border-bottom: 1px solid #d1dbe5;
}
.schema-example .editor {
  position: absolute;
  top: 49px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
