<template>
    <div class="doc-response">
        <pre class="code"><code v-html="html"></code></pre>
    </div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
export default {
    props: ['response'],
    data() {
        return {
            html: ''
        };
    },
    mounted() {
        this.html = Prism.highlight(JSON.stringify(this.response, null, 4), Prism.languages.javascript);
    }
};
</script>
<style>
</style>
