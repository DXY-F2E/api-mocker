<template>
    <div class="desc-box">
        <div class="hd">API Description</div>
        <textarea id="desc-editor" placeholder="接口描述" autofocus></textarea>
    </div>
</template>

<script>
import Simditor from 'simditor';
import $ from 'jquery';
import 'simditor/styles/simditor.css';

export default {
    watch: {
        apiId() {
            this.setValue();
        }
    },
    methods: {
        setValue() {
            if (this.$store.state.api.desc === null) {
                this.editor.setValue(null);
            } else {
                this.editor.setValue(this.desc);
            }
        },
        initEditor() {
            this.editor = new Simditor({
                textarea: $('#desc-editor'),
                toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment']
            });
            this.setValue();
            this.editor.on('valuechanged', () => {
                this.$store.commit('UPDATE_API_PROPS', ['desc', this.editor.getValue()]);
            });
        }
    },
    mounted() {
        this.initEditor();
    },
    computed: {
        desc() {
            return this.$store.state.api.desc;
        },
        apiId() {
            return this.$store.state.api._id;
        }
    }
};
</script>
<style>
.desc-box .hd{
    /*border-bottom: 0;*/
}
.desc-box .simditor {
    border: none;
}
#desc-editor {
    min-height: 200px;
}
</style>
