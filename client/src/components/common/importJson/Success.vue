<template>
<el-dialog class="import-json-check"
     title="解析Json成功，请核对"
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
            <span class="control preview" @click="preview(index, idx)">预览</span>
            <span class="control delete" @click="deleteApi(index, idx)">删除</span>
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
export default {
  props: {
    visible: Boolean,
    apisData: Array
  },
  data () {
    return {
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
    handleConfirm () {
      const data = this.apisData[0]
      this.$store.dispatch('createApis', {
        groupId: data.groupId,
        apis: data.apis
      }).then(rs => {
        if (rs.data.apis.length > 0) {
          this.$message.success('保存成功')
          this.dialogVisible = false
        } else {
          this.$message.success('保存失败')
        }
      }).catch(err => {
        const message = err.msg || err.response.data.message
        this.$message.error(`保存失败:${message}`)
      })
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
