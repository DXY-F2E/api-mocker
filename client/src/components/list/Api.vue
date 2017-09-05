<template>
  <el-card class="card-box" @click.native="editApi(data)">
   <div slot="header" class="clearfix">
    <span class="name">{{data.name}}</span>
    <el-button-group>
     <el-button size="mini" icon="document" @click.native.stop="showDoc()"></el-button>
     <el-button size="mini" @click.native.stop="confirmCopy(data.name)">
      <i class="material-icons">content_copy</i>
     </el-button>
    </el-button-group>
   </div>
   <div class="text item">
     <label class="manager"><code>Manager:</code></label><input v-model="manager" readonly :id="data._id" />
   </div>
   <div class="text item">
     <label><code>Method :</code></label>{{data.options.method}}
   </div>
  </el-card>
</template>
<script>
import R from 'ramda'
export default {
  props: {
    data: {
      type: Object,
      require: true
    }
  },
  computed: {
    manager () {
      return this.data.manager ? this.data.manager.name : '未知'
    }
  },
  data () {
    return {
      apiUrl: `${this.$store.state.serverRoot}/client/${this.data._id}`
    }
  },
  methods: {
    showDoc () {
      this.$router.push(`/doc/${this.data.group}/${this.data._id}`)
    },
    getApiCopyData () {
      const api = R.clone(this.data)
      delete api._id
      delete api.createTime
      delete api.modifiedTime
      api.name = `${api.name}-副本`
      return api
    },
    confirmCopy (apiName) {
      this.$confirm(`确定复制接口：${apiName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.copyApi()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消复制'
        })
      })
    },
    copyApi () {
      const api = this.getApiCopyData()
      this.$store.dispatch('copyApi', api).then(() => {
        this.$message.success('复制成功')
      }).catch(err => this.$message.error(err.msg))
    },
    editApi (api) {
      this.$store.commit('UPDATE_API', api)
      this.$store.commit('CHANGE_MODE', 'edit')
      this.$router.push(`/edit/${api.group}/${api._id}`)
    }
  }
}
</script>
<style lang="less">
.el-card {
  cursor: pointer;
  transition: all 0.2s ease;
  width: 219px;
  overflow: hidden;

  &:hover {
    background-color: #F9FAFC;
  }
  .el-card__body {
    padding: 15px 20px;
  }
  .el-card__header {
    padding: 8px 20px;
  }
}
.edit-api {
  float: right;
  position: relative;
  top: -4px;
}

.item {
  color: #8492A6;

  label {
    color: #475669;
    margin-right: 5px;
    width: 70px;
    display: inline-block;
  }
  input {
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    line-height: 1;
    line-height: 20px;
    height: 20px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.card-box {
  .clearfix {
    height: 22px;
    line-height: 22px;
    position: relative;
  }
  .name {
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-button-group {
    position: absolute;
    right: -10px;
    top: 0;
    visibility: hidden;
    cursor: pointer;

    .material-icons {
      font-size: 14px;
      position: relative;
      top: -1px;
    }
  }

  &:hover {
    .name {
      width: 130px;
    }
    .el-button-group {
      visibility: visible;
    }
  }

  .el-button-group {
    .el-button:focus,
    button {
      background-color: #F9FAFC;
      color: #8492A6;
      border-color: #bfcbd9;
      width: 22px;
      height: 22px;
    }
    .el-button:hover {
      background-color: #E5E9F2;
      color: #475669;
    }
  }
}
</style>
