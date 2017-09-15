<template>
  <div class="json-editor" :class="isFullscreen ? 'fullscreen' : ''" :style="{height: height}">
    <div class="toolbar">
      <el-select v-if="templates" v-model="template" size="mini" placeholder="模板" @change="setTemplateVal()">
        <el-option
          v-for="(val, idx) in templates"
          :label="'模板' + (idx+1)"
          :key="idx"
          :value="idx">
        </el-option>
      </el-select>
      <el-button size="mini" v-if="parseTool" @click="parseEditor()">Parse</el-button>
      <el-button size="mini"
           v-if="fullscreenTool"
           @click="fullscreen()">{{isFullscreen ? '取消' : ''}}全屏</el-button>
    </div>
    <div :id="id" class="editor-range" @keyup="keyupBehavior"></div>
  </div>
</template>

<script>
import * as ace from 'brace'
import 'brace/mode/json'
import R from 'ramda'

export default {
  data () {
    return {
      isFullscreen: false,
      template: null,
      silent: false
    }
  },
  props: {
    parseTool: {
      type: Boolean,
      default: false
    },
    fullscreenTool: {
      type: Boolean,
      default: false
    },
    templates: {
      type: Array
    },
    id: {
      type: String,
      default () {
        const random = Math.ceil(Math.random() * 1000000)
        return `jsonEditorId_${random}`
      }
    },
    value: {
      type: null
    },
    name: {
      type: String,
      default: 'Json'
    },
    height: {
      type: String,
      default: '100%'
    },
    readonly: Boolean,
    resizeAct: null
  },
  watch: {
    resizeAct () {
      this.editorResize()
    },
    value (newVal) {
      if (!R.equals(newVal, this.getValue().data)) {
        this.setValue()
      }
    }
  },
  methods: {
    editorResize () {
      window.setTimeout(() => {
        this.editor.resize(true)
      })
    },
    keyupBehavior (e) {
      // 按Esc键退出全屏
      if (this.isFullscreen && e.keyCode === 27) {
        this.fullscreen()
      }
    },
    fullscreen () {
      this.isFullscreen = !this.isFullscreen
      window.setTimeout(() => {
        this.editor.resize(true)
        this.editor.focus()
      })
    },
    setTemplateVal () {
      const data = JSON.parse(this.templates[this.template])
      this.editor.setValue(JSON.stringify(data, null, '\t'), 1)
    },
    validate () {
      try {
        JSON.parse(this.editor.getValue())
        return true
      } catch (err) {
        this.$message.error('response 未正确填写')
        return false
      }
    },
    setValue () {
      this.silent = true
      if (this.value) {
        this.editor.setValue(JSON.stringify(this.value, null, '\t'), 1)
      } else {
        this.editor.setValue('')
      }
      this.silent = false
    },
    getValue () {
      try {
        const value = this.editor.getValue()
        const data = (value === '') ? '' : JSON.parse(this.editor.getValue())
        return {
          data,
          success: true
        }
      } catch (err) {
        return {
          success: false,
          msg: `${this.name}格式错误`
        }
      }
    },
    parseEditor () {
      let value = this.editor.getValue()
      try {
        value = JSON.parse(value)
        this.editor.setValue(JSON.stringify(value, null, '\t'), 1)
      } catch (err) {
        this.$message.error('请正确填写JSON')
      }
    },
    initEditor () {
      this.editor.setReadOnly(this.readonly)
      this.editor.getSession().on('change', () => {
        if (this.silent) {
          return
        }
        const data = this.getValue()
        if (!data.success) {
          this.$emit('change', data)
          return
        }
        // if (Object.keys(data.data).length <= 0) {
        //     this.$emit('change', {
        //         success: false,
        //         msg: `${this.name}空对象`
        //     });
        //     return;
        // }
        this.$emit('change', data)
      })
      this.setValue()
    }
  },
  beforeDestroy () {
    // editorEvent.$off('resize', this.editorResize);
    this.editor.destroy()
  },
  mounted () {
    this.editor = ace.edit(this.id)
    this.editor.getSession().setOptions({
      mode: 'ace/mode/json',
      tabSize: 4,
      useSoftTabs: true
    })
    // Automatically scrolling cursor into view after selection change this will be disabled in the next version set editor.$blockScrolling = Infinity to disable this message
    this.editor.$blockScrolling = Infinity

    // 设置自动高度，然而并没什么用
    // this.editor.setAutoScrollEditorIntoView(true);

    // editorEvent.$on('resize', this.editorResize);
    this.initEditor()
  }
}
</script>
<style>
.json-editor {
  position: relative;
  /*height: 300px;*/
}
.fullscreen .json-editor {
  height: auto;
}
.json-editor.fullscreen {
  position: fixed;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
}
.json-editor .toolbar > * {
  vertical-align: top;
}
.json-editor.fullscreen .editor-range {
  height: 100%;
}
.json-editor .editor-range{
  height: 100%;
}
.json-editor .toolbar .el-select {
  width: 80px;
  margin-right: 12px;
}
.json-editor .toolbar {
  position: absolute;
  right: 10px;
  top: 0;
  z-index: 2;
  padding: 10px;
}
</style>
