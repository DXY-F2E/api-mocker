<template>
  <div>
    <el-table :data="data" size="medium" @sort-change="sortChange">
      <el-table-column label="接口名称" prop="name" sortable="custom">
      </el-table-column>
      <el-table-column label="方法 Method" prop="options.method"></el-table-column>
      <el-table-column label="线上路径" prop="prodUrl"></el-table-column>
      <el-table-column label="Mock Hash" prop="_id"></el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="{row}">
          {{ row.manager ? row.manager.name : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="{row}">
          {{ row.createTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button v-if="actions.includes('doc')" type="text" @click="showDoc(row)">查看文档</el-button>
          <el-button v-if="actions.includes('edit')" type="text" @click="editDoc(row)">编辑</el-button>
          <el-button v-if="actions.includes('copy')" type="text" @click="confirmCopy(row)">复制</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/** 分组-接口列表
 * 创建接口、导入Rap JSON, 导入Swagger JSON
 * 列表字段：接口名称、manager、method、path
 */
import R from 'ramda'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => ['doc', 'edit', 'copy']
    }
  },
  data () {
    return {
      rootDomain: window.location.href.split('#')[0]
    }
  },
  methods: {
    sortChange (column) {
      let {prop, order} = column
      let sortObject = {}
      if (prop) {
        sortObject[prop] = order === 'ascending' ? 1 : -1
      }
      this.$emit('sort', JSON.stringify(sortObject))
    },
    showDoc (api) {
      const url = `${this.rootDomain}#/doc/${api.group}/${api._id}`
      window.open(url, '_blank')
    },
    editDoc (api) {
      this.$store.commit('doc/UPDATE_API', api)
      this.$store.commit('doc/CHANGE_MODE', 'edit')
      const url = `${this.rootDomain}#/edit/${api.group}/${api._id}`
      window.open(url, '_blank')
    },
    getApiCopyData (data) {
      const api = R.clone(data)
      delete api._id
      delete api.createTime
      delete api.modifiedTime
      api.name = `${api.name}-副本`
      return api
    },
    confirmCopy (api) {
      this.$confirm(`确定复制接口：${api.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.copyApi(api)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消复制'
        })
      })
    },
    copyApi (api) {
      const copyApi = this.getApiCopyData(api)
      this.$store.dispatch('copyApi', copyApi).then(() => {
        this.$message.success('复制成功')
      }).catch(err => this.$message.error(err.msg))
    }
  }
}
</script>
<style lang='less'>
.add-api {
  .el-card {
    .el-card__body {
      height: 105px;
      line-height: 75px;
      text-align: center;
      font-size: 16px;
      color: #324057;
    }
    .el-card__body .el-dialog {
      line-height: initial;
      text-align: left;
    }
  }
  i {
    font-size: 18px;
    color: #99A9BF;
    margin-right: 10px;
  }
  .el-upload {
    width: 100%;
  }
}
.material-icons {
  font-size: 12px;
  line-height: 1;
}
</style>
