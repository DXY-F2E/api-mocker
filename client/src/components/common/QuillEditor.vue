<template>
<div class="editor-box">
  <div :id="editorId" class="quill-editor"></div>
</div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  props: {
    editorId: {
      type: String,
      default () {
        const random = Math.ceil(Math.random() * 1000000)
        return `editorId_${random}`
      }
    },
    toolbar: {
      type: Array,
      default () {
        return [
     [{ header: [1, 2, 3, 4, 5, 6, false] }],
     ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }],
     [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
     ['link', 'image', 'blockquote', 'code-block'],
     ['clean']
        ]
      }
    },
    placeholder: {
      type: String,
      default: '请填写'
    },
    value: null
  },
  data () {
    return {
      editor: {}
    }
  },
  watch: {
    value (newVal) {
      if (newVal !== this.$editor.innerHTML) {
        this.$editor.innerHTML = this.value
      }
    }
  },
  methods: {
    setValue () {

    },
    initEditor () {
      this.editor = new Quill(`#${this.editorId}`, {
        modules: {
          toolbar: this.toolbar
        },
        placeholder: this.placeholder,
        theme: 'snow'
      })
      this.$editor = document.querySelector(`#${this.editorId} .ql-editor`)
      this.$editor.innerHTML = this.value
      this.editor.on('text-change', (delta) => {
        window.console.log(delta)
        window.console.log(this.editor.getContents())
      })
    }
  },
  mounted () {
    this.initEditor()
  }
}
</script>
<style>
.editor-box .ql-editor{
  min-height: 300px;
}
.editor-box .ql-toolbar.ql-snow {
  border: none;
  border-bottom: 1px solid #D3DCE6;
}
.editor-box .ql-container.ql-snow {
  border: none;
}
</style>
