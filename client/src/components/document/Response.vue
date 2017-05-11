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
    computed: {
        html() {
            return this.response ? Prism.highlight(JSON.stringify(this.response, null, 4), Prism.languages.javascript) : '{}';
        }
    }
};
</script>
<style>
</style>
