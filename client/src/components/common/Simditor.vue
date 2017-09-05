<template>
<div class="editor-box">
  <textarea :id="id" :placeholder="placeholder" autofocus></textarea>
</div>
</template>

<script>
import Simditor from 'simditor'
import $ from 'jquery'
import 'simditor/styles/simditor.css'

export default {
  props: {
    id: {
      type: String,
      default () {
        const random = Math.ceil(Math.random() * 1000000)
        return `editorId_${random}`
      }
    },
    toolbar: {
      type: Array,
      default () {
        return ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment']
      }
    },
    placeholder: {
      type: String,
      default: '请填写'
    },
    value: null
  },
  watch: {
    value (newVal) {
      if (newVal !== this.editor.getValue()) {
        this.editor.setValue(this.value)
      }
    }
  },
  methods: {
    initEditor () {
      this.editor = new Simditor({
        textarea: $(`#${this.id}`),
        toolbar: this.toolbar
      })
      this.editor.setValue(this.value)
      window.setTimeout(() => this.editor.blur())
      this.editor.on('valuechanged', () => {
        if (this.editor.getValue() !== this.value) {
          this.$emit('change', this.editor.getValue())
        }
      })
    }
  },
  mounted () {
    this.initEditor()
  }
}
</script>
<style>
.editor-box .simditor {
  border: none;
}
#desc-editor {
  min-height: 200px;
}
.editor-box .simditor .simditor-body p,
.editor-box .editor-style p {
  margin-bottom: 0;
}
</style>
