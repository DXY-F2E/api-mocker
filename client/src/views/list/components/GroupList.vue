<template>
  <div>
    <el-table style="width: 100%" :data="data" size="medium">
      <el-table-column label="分组名称" prop="name"></el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="{row}">
          {{ row.creator ? row.creator.name : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="goApiList(row)">接口列表</el-button>
          <el-button type="text" @click="goDocList(row)">查看文档</el-button>
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
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rootDomain: window.location.href.split('#')[0]
    }
  },
  methods: {
    goApiList (group) {
      this.$router.push({name: 'GruopList', params: { groupId: group._id }})
    },
    goDocList (group) {
      this.$router.push({name: 'GroupDoc', params: { groupId: group._id }})
    }
  }
}
</script>
