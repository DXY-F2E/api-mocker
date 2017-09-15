<template>
  <div class="doc-mock-data">
    <pre class="code"><code v-html="html"></code></pre>
  </div>
</template>

<script>
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
export default {
  props: ['mockData'],
  computed: {
    html () {
      return this.mockData ? Prism.highlight(JSON.stringify(this.mockData, null, 4), Prism.languages.javascript) : '{}'
    }
  }
}
</script>
<style>
</style>
