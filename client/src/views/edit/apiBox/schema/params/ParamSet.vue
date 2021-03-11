<template>
  <div class="param set" :class="name">
    <el-row type="flex" class="row-bg">
      <el-col class="key">
        <el-select v-model="param.key" allow-create filterable placeholder="key" @change="update" v-if="name === 'headers'">
          <el-option v-for="(item, index) in requestheadersList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <el-input placeholder="key" v-model="param.key" @input="lazyUpdate" v-else></el-input>
      </el-col>
      <el-col class="config" v-if="name !== 'headers'">
        <el-cascader
          popper-class="type-cascader"
          @change="changeParamType"
          :options="tpyeList"
          :value="apiType">
        </el-cascader>
        <el-checkbox v-model="param.required" @change="update">必填</el-checkbox>
      </el-col>
      <el-col class="max-length" v-if="name !== 'headers'">
        <el-input placeholder="最大长度" type="number" :disabled="param.type !== 'string'" v-model.number="param.maxLength" :min=1 @input="lazyUpdate"></el-input>
      </el-col>
      <el-col class="comment">
        <el-input placeholder="备注" v-model="param.comment" @input="lazyUpdate"></el-input>
      </el-col>
      <el-col class="example">
        <el-input placeholder="example" v-model="exampleInput"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { debounce } from '@/util'
import headersList from '@/util/requestHeaders'

export default {
  props: {
    param: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: false
    }
  },
  computed: {
    apiType () {
      const type = [this.param.type]
      if (this.param.type === 'array') {
        type.push(this.param.items.type)
      }
      return type
    },
    tpyeList () {
      return this.getTypeList()
    }
  },
  data () {
    return {
      timer: null,
      isFirstTime: true,
      exampleInput: '',
      selectedOptions: [],
      lazyUpdate: this.update.bind(this, true),
      exampleUpdate: false,
      requestheadersList: headersList
    }
  },
  created () {
    this.setExampleInput()
  },
  mounted () {
    this.$nextTick(() => {
      this.isFirstTime = false
      this.setExampleInput()
    })
  },
  watch: {
    'param.example': {
      handler () { this.setExampleInput() },
      deep: true
    },
    'exampleInput': 'setExample'
  },
  methods: {
    changeParamType (val) {
      this.$set(this.param, 'type', val[0])
      if (val[0] === 'object') {
        if (!this.param.params) {
          this.$set(this.param, 'params', [{
            key: null,
            type: 'string',
            required: true
          }])
        }
        this.$emit('buildObject', this.param)
      } else if (val[0] === 'array') {
        this.setArrayType(val[1])
      }
      this.setExample()
    },
    setArrayType (type) {
      this.$set(this.param, 'items', {
        type
      })
      if (type === 'object' && !this.param.items.params) {
        this.$set(this.param.items, 'params', [{
          key: null,
          type: 'string',
          required: true
        }])
        this.$emit('buildObject', this.param)
      }
    },
    update (immediately) {
      // 这里第一次给各输入框赋值时不应该触发change
      if (!this.isFirstTime) {
        this.timer = null
        if (immediately) {
          this.$emit('change', this.param)
        } else {
          // debounce
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.$emit('change', this.param)
          }, 100)
        }
      }
    },
    getDefaultType () {
      const type = [this.param.type]
      if (this.param.type === 'array') {
        type.push(this.param.items.type)
      }
      return type
    },
    getTypeList () {
      const types = []
      if (this.name === 'query' || this.name === 'path') {
        types.push('String', 'Number', 'Boolean')
      } else {
        types.push('String', 'Number', 'Boolean', 'Object', 'Array')
        if (this.name === 'body') {
          types.push('File')
        }
      }
      return types.map(t => {
        const type = {
          value: t.toLowerCase(),
          label: t
        }
        if (t === 'Array') {
          type.children = ['String', 'Number', 'Boolean', 'Object'].map(t => ({
            value: t.toLowerCase(),
            label: t
          }))
        }
        return type
      })
    },
    setExampleInput () {
      if (this.exampleUpdate) {
        this.exampleUpdate = false
        return
      }
      this.exampleInput = typeof this.param.example === 'string'
        ? this.param.example
        : JSON.stringify(this.param.example)
    },
    setExample () {
      this.exampleUpdate = true
      let value = this.exampleInput
      if (this.param.type === 'string') {
        this.param.example = value
      } else if (this.param.type === 'number') {
        this.param.example = parseFloat(value)
      } else {
        try {
          this.param.example = JSON.parse(value)
        } catch (err) {
          this.param.example = value
        }
      }
      this.update()
    }
  }
}
</script>
<style lang="less">
.type-cascader .el-cascader-menu {
  height: auto;
}
.param.set .el-checkbox {
  height: 36px;
  line-height: 35px;
}
.params-box {
  .config {
    min-width: 220px;
    max-width: 220px;
  }
  .headers .config {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
  }
  .value, .max-length, .example {
    min-width: 145px;
    max-width: 220px;
  }
  .comment {
    margin-right: 20px;
    min-width: 145px;
    max-width: 240px;
  }
  .key {
    min-width: 100px;
  }
  .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #eff2f7;
    font-family: monospace;
  }
  .el-input-number {
    width: 100%;
  }
  .el-select {
    margin-right: 20px;
  }
}
</style>
