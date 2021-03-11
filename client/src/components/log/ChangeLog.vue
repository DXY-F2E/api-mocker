<template>
  <el-dialog :visible.sync="value" center title="Api mocker 更新说明">
    <div class="dialog-body">
      <div class="log-item" v-for="(item, i) in changeLogs" :key="i">
        <strong>{{item.type}}: </strong>
        {{ item.label }}
      </div>
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
      version: '1.4.3',
      endTime: '2020-11-19',
      current: localStorage.getItem('change-log-version'),
      changeLogs: [
        { type: 'feat', label: '强化了接口路径的概念及使用，创建接口时路径调整为必填项（编辑时选填，兼容老数据），从而解决了mock api与真实接口路径不一致问题，便于（主要是前端同学）对同组接口做统一配置和管理（理论上不同环境的api只需要切换baseUrl）；同时解决了hash模式api语义丢失问题' },
        { type: 'feat', label: '基于接口路径的强化，实现了健壮的RESTful风格api的创建与解析' },
        { type: 'feat', label: '组维度添加了各环境接口的统一前缀配置，方便后端同学创建api时进行接口路径的自动拼接，减少大量重复配置' },
        { type: 'fix', label: '修复首页搜索框输入内容自动删除、抖动问题' }
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
