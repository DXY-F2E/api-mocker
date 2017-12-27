<template>
  <div class="doc-schemas">
    <schema v-for="(schema, key) in schemas"
            :schema="schema"
            :key="key"
            :name="name"
            :class="diffStyle(key)"
            :diff-mode="diffMode"
            :diff-stack="diffStack"
            :diff-path="diffPath + '.' + key + '.params'"></schema>
  </div>
</template>

<script>
import Schema from './Schema'
import { getDiffStyle } from '@/util/jsonDiff'
export default {
  components: {
    Schema
  },
  props: {
    schemas: {
      type: Array,
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
  computed: {
    diffMode () {
      return this.$store.diffMode
    }
  },
  methods: {
    diffStyle (path) {
      return getDiffStyle(this.diffStack, `${this.diffPath}.${path}`)
    }
  }
}
</script>
