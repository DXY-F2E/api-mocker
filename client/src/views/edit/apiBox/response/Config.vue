<template>
<div class="config-box">
  <el-form label-position="right" label-width="82px">
    <el-form-item label="返回结果：" class="delay">
      <el-select v-model="responseIndex" placeholder="请选择">
        <el-option
          v-for="(r, key) in response"
          :key="key"
          :label="r.statusText"
          :value="key">
        </el-option>
        <el-option
          :key="-1"
          label="随机"
          :value="-1">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="模拟延迟：" class="delay">
      <el-input v-model="delay"></el-input>
      <em class="unit">ms</em>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('doc', ['api']),
    response () {
      return this.api.options.response
    },
    delay: {
      get () {
        return this.api.options.delay
      },
      set (val) {
        this.updateDelay(val)
      }
    },
    responseIndex: {
      get () {
        return this.api.options.responseIndex
      },
      set (value) {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.responseIndex', value])
        this.$store.commit('doc/SET_API_CHANGED')
      }
    }
  },
  methods: {
    updateDelay (value) {
      value = window.parseInt(value)
      if (isNaN(value)) {
        value = 0
      }
      this.$store.commit('doc/UPDATE_API_PROPS', ['options.delay', value])
      this.$store.commit('doc/SET_API_CHANGED')
    }
  }
}
</script>
<style lang="less">
.config-box {
  display: inline-block;
  margin-left: 36px;

  .el-input {
    display: inline-block;
    width: 70px;
  }
  .el-select .el-input {
    width: 100px;
  }
  .el-input .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #bfcbd9;
    height: 20px;
  }
  .unit {
    color: #bfcbd9;
  }
  .delay.el-form-item {
    margin: 0 20px 0 0;
    display: inline-block;
  }
}
</style>
