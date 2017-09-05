<template>
  <div class="doc-params">
    <doc-param v-for="(param, key) in params" :key="key" :param="param" :level="level">
      <params v-if="param.type === 'object' && param.params"
            :params="param.params"
            :level="nextLevel"
            slot="params">
      </params>
      <params v-if="param.type === 'array' && param.items.type === 'object'"
          :params="param.items.params"
          :level="nextLevel"
          slot="params"></params>
    </doc-param>
  </div>
</template>

<script>
import DocParam from './Param'
export default {
  name: 'params',
  components: {
    DocParam
  },
  computed: {
    nextLevel () {
      return this.level + 1
    }
  },
  props: ['params', 'level']
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
