<template>
<el-dialog :title="title" :visible="visible" @open="initLocalGroup" @close="handleClear" :show-close="false" width="800px">
  <div style="padding-left: 50px;" v-loading="loading">
    <div>
    
    <div style="display: flex;">
    <div style="border-right: 1px solid #EBEEF5; flex: 1; margin-right: 80px;">
      <h4>请选择当前分组下要迁移的API</h4>
      <search style="width: 200px; margin-top: 10px;" @query="onQueryApi"
            v-model="queryApi"
            placeholder="按名称过滤"
            size="small">
    </search>
      <div :style="styleObject">
        <el-checkbox style="margin-top: 10px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedApis" @change="handleCheckedCitiesChange">
            <el-checkbox style="display: block; margin-top: 10px;" v-for="api in filterApis" :label="api._id" :key="api._id">{{api.name}}</el-checkbox>
          </el-checkbox-group>
      </div>
    </div>
    
    <div style="flex: 1;">
    <h4>请选择要迁移到的分组</h4>
        <search style="width: 200px; margin-top: 10px;" @query="onQuery"
            v-model="query"
            placeholder="按名称过滤"
            size="small">
    </search>
    <div :style="styleObject">
    <el-tree
    default-expand-all
      style="margin-top: 20px;"
        :data="moreGroupList"
        node-key="_id"
        @node-click="handleClickGroup"
        :expand-on-click-node="false">
        <div class="group-item" slot-scope="{ data }">
          <div class="group-item-wrap">
            <div>{{data.name}}</div>
          </div>
        </div>
      </el-tree>
    </div>
      <div style="margin-top: 30px;"><strong>迁移到</strong> {{getGroupName(targetGroup)}}</div>
    </div>
    </div>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</el-dialog>
</template>

<script>

import R from 'ramda'
import { mapState } from 'vuex'
import API from '@/config/api'
import Search from '@/components/common/SearchInput'

export default {
  components: {
    Search
  },
  props: {
    group: {
      type: Object,
      default: () => ({})
    },
    visible: Boolean
  },
  data () {
    return {
      styleObject: {
        overflow: 'auto',
        marginTop: '10px',
        maxHeight: `${document.documentElement.clientHeight * 40 / 100}px`
      },
      checkedApis: [],
      isIndeterminate: true,
      checkAll: false,
      loading: false,
      localGroup: R.clone(this.group),
      targetGroup: {},
      query: '',
      apis: [],
      queryApi: ''
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        if (val) {
          this.$nextTick(() => {
            this.getApis()
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState(['serverRoot', 'groups']),
    // 更多分组
    moreGroupList () {
      // this.groups转成树形结构
      const tree = this.getTree(this.groups)
      return this.getFilterTree(tree, this.query)
    },
    title () {
      return `迁移分组${this.localGroup.name}下的API`
    },
    filterApis () {
      if (!this.queryApi) return this.apis
      return this.apis.filter(i => (i.name && i.name.includes(this.queryApi)))
    }
  },
  methods: {
    getGroupName (group) {
      group.parents = this.getParent(group, this.groups)
      const { parents, name } = group
      if (!parents || parents.length === 0) return name
      return parents.map(g => g.name).join(' / ') + ' / ' + name
    },
    getParent (g, groups) {
      let res = []
      if (g.pGroup) {
        const parent = groups.find(group => group._id === g.pGroup)
        if (parent) res.push(parent)
        if (parent && parent.pGroup) res = [...this.getParent(parent, groups), ...res]
      }
      return res
    },
    handleCheckAllChange (val) {
      this.checkedApis = val ? this.filterApis.map(i => i._id) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.filterApis.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.filterApis.length
    },
    getApis () {
      const query = { page: 1, limit: 10000 }
      this.loading = true
      this.$http.get(API.GROUP_APIS.replace(':groupId', this.group._id), {
        params: query
      }).then(rs => {
        this.apis = rs.data.resources
      }).finally(() => {
        this.loading = false
      })
    },
    getFilterTree (tree, query) {
      if (!query) return tree
      return tree.filter(group => {
        if (!group.children || (group.children && group.children.length === 0)) {
          // 无children
          return group.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
        } else {
          if (group.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) return true
          const children = this.getFilterTree(group.children, query)
          if (children.length > 0) {
            group.children = children
            return true
          }
          return false
        }
      })
    },
    getTree (groups) {
      if (groups.length === 0) return []
      const roots = groups.filter(i => !i.pGroup)
      roots.forEach((g) => {
        this.getChildren(g, groups)
      })
      return roots
    },
    handleClickGroup (group) {
      if (this.localGroup._id === group._id) {
        this.$message({type: 'warning', message: '不能选择当前节点'})
        return
      }
      this.targetGroup = group
    },
    onQuery (val) {
      this.query = val
    },
    onQueryApi (val) {
      this.queryApi = val
    },
    handleClear () {
      this.localGroup = {}
      this.targetGroup = {}
      this.checkedApis = []
      this.isIndeterminate = true
      this.checkAll = false
      this.loading = false
      this.query = ''
      this.apis = []
      this.queryApi = ''
    },
    getChildren (g, groups) {
      g.children = groups.filter(i => i.pGroup === g._id)
      g.children.forEach((g) => {
        this.getChildren(g, groups)
      })
    },
    searchUsers (val) {
      this.users = this.allUsers.filter(u =>
        u.email.indexOf(val) >= 0 || u.name.indexOf(val) >= 0
      )
    },
    itemClick (val) {
      this.localGroup.member = R.symmetricDifference(this.localGroup.member, [val])
    },
    itemRemove (val) {
      this.localGroup.member = R.without([val], this.localGroup.member)
    },
    initLocalGroup () {
      this.localGroup = R.clone(this.group)
    },
    cancel () {
      this.$emit('hide')
    },
    confirm () {
      if (!this.checkedApis || this.checkedApis.length === 0) {
        this.$message({type: 'warning', message: '请选择待迁移的API'})
        return
      }
      if (!this.targetGroup._id) {
        this.$message({type: 'warning', message: '请选择待迁移到的分组'})
        return
      }
      this.$store.dispatch('moveApis', {
        targetGroup: this.targetGroup._id,
        apis: this.checkedApis
      }).then(rs => {
        this.$message.success({type: 'success', message: '迁移成功'})
        this.checkedApis = []
        this.checkAll = false
        // this.targetGroup =
        this.$router.push('/')
        this.$emit('hide')
      }).catch(err => this.$message({type: 'error', message: err.msg}))
    },
    manageChange (item) {
      this.localGroup.manager = item.id
    },
    handleCopy () {
      if (this.localGroup.token) {
        this.$refs.token.select()
        document.execCommand('copy')
        this.$message({ type: 'success', message: '复制成功', duration: 1000 })
      } else {
        this.$message.error('请点击刷新按钮，生成分组token')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tip-icon {
  position: absolute;
  margin-left: -130px;
  margin-top: 10px;
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
  background: #97a8be;
  color: #fff;
}
.token-wrapper {
  display: flex;
  align-items: center;
  padding-right: 16px;
  .icon {
    font-size: 20px;
    margin-left: 8px;
    cursor: pointer;
  }
}
.tip {
  font-size: 12px;
  margin-top: 12px;
  line-height: 1;
}
.dialog-footer {
  text-align: right;
  margin-top: 30px;
}
</style>
