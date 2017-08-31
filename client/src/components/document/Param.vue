<template>
  <div class="doc-param" v-if="param.key">
    <el-row type="flex">
      <!-- <em class="split-line" :style="splitStyle"></em> -->
      <el-col class="key" :style="keyStyle">{{param.key}}</el-col>
      <div class="row-and-col">
        <el-col class="type">{{param.type}}<code class="array-type" v-if="param.type === 'array'">[{{param.items.type}}]</code></el-col>
        <el-col class="required">{{param.required ? '是' : '否'}}</el-col>
        <el-col class="comment">{{param.comment ? param.comment : '无'}}</el-col>
        <el-col class="example">{{param.example !== undefined ? param.example : '无'}}</el-col>
      </div>
    </el-row>
    <slot name="params"></slot>
  </div>
</template>

<script>
export default {
  name: 'docParam',
  props: ['param', 'level'],
  data () {
    return {
      keyStyle: {
        marginLeft: `-${this.level * 20}px`,
        textIndent: `${this.level * 20}px`
      },
      splitStyle: {
        width: this.level ? '1px' : 0,
        left: `${this.level * 20}px`
      }
    }
  }
}
</script>
<style>
.doc-param .array-type {
  color: #e96900;
}
.split-line {
  position: absolute;
  width: 1px;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: #e6e6e6;
  z-index: 1;
}
</style>
