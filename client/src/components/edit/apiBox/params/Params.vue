<template>
  <div class="params-box">
    <api-param :params="params"
               :param="param"
               :name="name"
               :level="level"
               v-for="(param, idx) in params" :key="idx"
               @change="(data) => update(data, idx)"
               @addParam="() => addParam(idx)"
               @deleteParam="() => deleteParam(idx)">
      <params v-if="isNext(param)"
              :params="nextParams(param)"
              :name="name"
              slot="params"
              :level="level + 1"
              @change="(data) => update(data, idx)"></params>
    </api-param>
  </div>
</template>

<script>
import ApiParam from './Param'
export default {
  name: 'params',
  components: {
    ApiParam
  },
  props: {
    level: {
      type: Number,
      required: true
    },
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
    isNext (param) {
      return param.type === 'object' || (param.type === 'array' && param.items.type === 'object')
    },
    nextParams (param) {
      return param.type === 'object' ? param.params : param.items.params
    },
    change () {
      this.$emit('change', this.params)
    },
    update (data, idx) {
      if (data.length === undefined) {
        this.$set(this.params, idx, data)
      } else {
        this.$set(this.params[idx], 'params', data)
      }
      this.change()
    },
    addParam (idx) {
      const param = {
        key: null,
        type: 'string',
        required: true
      }
      this.params.splice(idx + 1, 0, param)
      this.change()
    },
    deleteParam (idx) {
      if (this.params.length === 1) {
        return
      }
      this.params.splice(idx, 1)
      this.change()
    }
  }
}
</script>
<style lang="less">
.params-box {
  position: relative;

  &.set {
    padding-left: 66px;
  }
  .params-box {
    padding-left: 25px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      width: 1px;
      left: 0px;
      top: 4px;
      bottom: 16px;
      background-color: #d1dbe5;
    }

    .param:before {
      content: '';
      position: absolute;
      width: 8px;
      height: 1px;
      background-color: #d1dbe5;
      left: -25px;
      top: 19px;
    }
  }
  .param {
    position: relative;
    z-index: 0;
  }
  .el-cascader .el-input {
    width: 140px;
  }
  .fill .name {
    min-width: 140px;
    /*max-width: 300px;*/
    padding-left: 10px;
    margin-right: 10px;

    label {
      display: block;
      line-height: 36px;
      height: 36px;
      border-bottom: 1px solid #EFF2F7;
    }
  }
  code {
    color: #e96900;
    margin: 0 2px;
    border-radius: 2px;
    white-space: nowrap;
  }
}
</style>
