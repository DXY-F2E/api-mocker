<template>
  <el-dialog :visible.sync="value" center title="Api mocker 更新说明">
    <div class="dialog-body">
      <div class="log-item" v-for="(item, i) in changeLogs" :key="i">{{ item.label }}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox v-model="notTip" class="not-tip">不再提示</el-checkbox>
      <el-button type="primary" @click="value = false">知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      version: '1.3.3',
      endTime: '2018-12-31',
      current: localStorage.getItem('change-log-version'),
      changeLogs: [
        { label: 'feat: 添加了 example 的验证，在创建/更新接口时，example 必须按照 schema 规则书写！！！' },
        { label: '注意: example 中的多余字段也不允许！' },
        { label: 'feat: 添加组管理移交到其他人下。' }
      ]
    }
  },
  computed: {
    value: {
      get () { return this.visible },
      set (val) { this.$emit('update:visible', val) }
    },
    notTip: {
      get () { return this.current === this.version },
      set (val) {
        if (val) this.current = this.version
        else this.current = ''
      }
    }
  },
  watch: {
    'current' (val) {
      localStorage.setItem('change-log-version', val)
    }
  },
  created () {
    let endTime = new Date(this.endTime).getTime()
    let now = new Date().getTime()
    if (now > endTime) return
    if (!this.notTip) {
      this.value = true
      this.notTip = true
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-body {
  padding: 20px;
}
.log-item {
  margin-bottom: 10px;
}
.not-tip {
  margin-right: 10px;
}
</style>
