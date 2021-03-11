<template>
<el-dialog class="import-json-check"
     title="解析JSON成功，请核对"
     :visible.sync="dialogVisible"
     size="small">
  <div class="import-apis">
    <el-tabs v-model="activeGroup" type="card">
      <el-tab-pane v-for="(item, index) in apisData"
            :key="index"
            :label="item.groupName"
            :name="item.groupName">
        <ul>
          <li v-for="(api, idx) in item.apis" :key="idx" class="api">
            <span class="name">{{api.name}}</span>
            <el-button size="mini" type="primary" @click="preview(index, idx)">预览</el-button>
            <el-button size="mini" type="danger" @click="deleteApi(index, idx)">删除</el-button>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
  <span slot="footer" class="dialog-footer">
  <el-button @click="dialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="handleConfirm">保 存</el-button>
  </span>
</el-dialog>
</template>

<script>
import { Loading } from 'element-ui'

export default {
  props: {
    visible: Boolean,
    apisData: Array,
    importType: Number
  },
  data () {
    return {
      fullscreenLoading: false,
      activeGroup: this.apisData[0] ? this.apisData[0].groupName : ''
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('visibleChange', val)
      }
    }
  },
  methods: {
    preview (groupIndex, apiIndex) {
      const previewApis = this.apisData[groupIndex].apis.map((api, idx) => {
        api._id = idx.toString()
        return api
      })
      window.sessionStorage.setItem('_previewApis', JSON.stringify(previewApis))
      const rootDomain = window.location.href.split('#')[0]
      const url = `${rootDomain}#/doc/${this.apisData[groupIndex].groupId}/${apiIndex}?preview=1`
      window.open(url, '_blank')
    },
    deleteApi (groupIndex, apiIndex) {
      this.apisData[groupIndex].apis.splice(apiIndex, 1)
      // 因为splice删除的是数组里的数组，所以得手动set触发视图更新
      this.$set(this.apisData, groupIndex, this.apisData[groupIndex])
    },
    importApis () {
      let loadingInstance = Loading.service({text: '导入中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'})
      let apis = []
      this.apisData.forEach((data) => { apis = apis.concat(data.apis) })
      apis.forEach((api) => { api._id && delete api._id })

      if (apis.length) {
        this.$store.dispatch('createApis', { groupId: apis[0].group, apis, importType: this.importType }).then(rs => {
          loadingInstance.close()
          this.$message.success('导入成功')
          this.dialogVisible = false
          this.$emit('refresh')
        }).catch(err => {
          loadingInstance.close()
          const message = err.msg || err.response.data.message
          this.$message.error(`保存失败:${message}`)
        })
      }
    },
    handleConfirm () {
      let {importType} = this
      if (importType === 1) {
        this.$confirm('覆盖导入会覆盖掉该分组内全部接口数据，建议先导出分组备份数据, 确定要覆盖导入吗？', '提示', {type: 'warning'}).then(() => {
          this.importApis()
        }).catch(() => { this.dialogVisible = false })
      } else {
        this.importApis()
      }
    }
  }
}
</script>
<style lang="less">
.import-apis .api {
  display: flex;
  border-bottom: 1px solid #EFF2F7;
  padding: 10px 0;

  & > span {
    display: block;
  }
  .name {
    flex: 999;
  }
  .control {
    min-width: 40px;
    text-align: center;
    color: #8492A6;
  }
}
.import-apis .el-tabs__content {
  max-height: 300px;
  overflow-y: auto;
}
</style>
