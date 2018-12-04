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
      version: '1.3.2',
      current: localStorage.getItem('change-log-version'),
      changeLogs: [
        { label: 'feat: 接口列表跳转默认跳转到文档模式，小图标改为编辑模式' },
        { label: 'fix: 接口列表名称太长显示不下' },
        { label: 'fix: 文档模式，左侧菜单滚动到当前项' },
        { label: 'fix: 接口添加返回状态时，添加复制操作' },
        { label: 'fix: 编辑模式保存后 3s 内不能重复保存' },
        { label: 'fix: 编辑模式下更便捷的切换到文档模式' }
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
    let endTime = 1544486400000
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
