<template>
  <div class="doc-param" v-if="param.key" :class="diffStyle">
    <el-row type="flex">
      <!-- <em class="split-line" :style="splitStyle"></em> -->
      <el-col class="key" :style="keyStyle" :class="getDiffStyle('key')">{{param.key}}</el-col>
      <div class="row-and-col">
        <el-col class="type" :class="getDiffStyle('type')">{{param.type}}<code class="array-type" v-if="param.type === 'array'">[{{param.items.type}}]</code></el-col>
        <el-col class="required" :class="getDiffStyle('required')">{{param.required ? '是' : '否'}}</el-col>
        <el-col class="comment" :class="getDiffStyle('comment')">{{param.comment ? param.comment : '无'}}</el-col>
        <el-col class="example" :class="getDiffStyle('example')">{{param.example !== undefined ? param.example : '无'}}</el-col>
      </div>
    </el-row>
    <slot name="params"></slot>
  </div>
</template>

<script>
import { getDiffStyle } from '@/util/jsonDiff'
export default {
  name: 'docParam',
  props: {
    param: {
      type: Object,
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
  },
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
  },
  computed: {
    diffStyle () {
      return getDiffStyle(this.diffStack, this.diffPath)
    }
  },
  methods: {
    getDiffStyle (path) {
      return getDiffStyle(this.diffStack, `${this.diffPath}.${path}`)
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
