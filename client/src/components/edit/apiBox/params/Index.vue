<template>
  <params :params="params"
          :name="name"
          class="set"
          :level="1"
          @change="update"></params>
</template>

<script>
import Params from './Params'
export default {
  components: {
    Params
  },
  beforeUpdate () {
    this.rebuildParams()
  },
  beforeMount () {
    this.rebuildParams()
  },
  props: {
    params: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: false
    }
  },
  methods: {
    rebuildParams () {
      if (!this.params || this.params.length === 0) {
        this.params.push({
          key: null,
          type: 'string',
          required: true
        })
      }
    },
    getFillValue (params) {
      const value = {}
      params.forEach(p => {
        if (p.type === 'object' && p.params) {
          const v = this.getFillValue(p.params)
          if (Object.keys(v).length > 0) {
            value[p.key] = v
            this.$set(p, 'value', v)
          }
        } else if (p.value) {
          value[p.key] = p.value
        }
      })
      return value
    },
    update () {
      if (this.mode === 'fill') {
        const value = this.getFillValue(this.params)
        this.$emit('updateParams', this.params, value)
      } else {
        this.$emit('updateParams', this.params)
      }
    }
  }
}
</script>
