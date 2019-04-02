<template>
  <div class="doc-params">
    <doc-param v-for="(param, key) in params"
               :key="key"
               :param="param"
               :level="level"
               :diff-mode="diffMode"
               :diff-stack="diffStack"
               :diff-path="diffPath + '.' + key">
      <params v-if="param.type === 'object' && param.params"
              :params="param.params"
              :level="nextLevel"
              :class="diffStyle(key + '.params')"
              :diff-mode="diffMode"
              :diff-stack="diffStack"
              :diff-path="diffPath + '.' + key + '.params'"
              slot="params">
      </params>
      <params v-if="param.type === 'array' && param.items.type === 'object'"
              :params="param.items.params"
              :class="diffStyle(key + '.items.params')"
              :diff-mode="diffMode"
              :diff-stack="diffStack"
              :diff-path="diffPath + '.' + key + '.items.params'"
              :level="nextLevel"
              slot="params"></params>
    </doc-param>
  </div>
</template>

<script>
import DocParam from './Param'
import { getDiffStyle } from '@/util/jsonDiff'
export default {
  name: 'params',
  components: {
    DocParam
  },
  computed: {
    diffMode () {
      return this.$store.diffMode
    },
    nextLevel () {
      return this.level + 1
    }
  },
  methods: {
    diffStyle (path) {
      return getDiffStyle(this.diffStack, `${this.diffPath}.${path}`)
    }
  },
  props: {
    params: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    diffStack: {
      type: Object,
      required: false
    },
    diffPath: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="less">
.doc-params {
  position: relative;

  .doc-params {
    padding-left: 20px;

    &:before {
      content: '';
      position: absolute;
      width: 1px;
      left: 20px;
      top: 0px;
      bottom: 0px;
      background-color: #e6e6e6;
      z-index: 1;
    }
  }
}
.doc-param {
  position: relative;
  z-index: 0;
}
</style>
