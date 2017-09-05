<template>
  <div class="doc-schemas">
    <schema v-for="(schema, key) in schemas" :schema="schema" :key="key" :name="name"></schema>
  </div>
</template>

<script>
import Schema from './Schema'
export default {
  components: {
    Schema
  },
  props: ['schemas', 'name']
}
</script>
