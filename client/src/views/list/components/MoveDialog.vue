<template>
<el-dialog :title="title" :visible="visible" @open="initLocalGroup" @close="handleClose" :show-close="false" width="600px">
  <div style="padding-left: 50px;">
    <el-checkbox v-model="moveToTop">迁移到顶层（即无父分组）</el-checkbox>
    <div v-if="!moveToTop" style="margin-top: 20px;">
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
      localGroup: R.clone(this.group),
      targetGroup: {},
      moveToTop: false,
      query: ''
    }
  },
  mounted () {
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
      return `迁移分组${this.localGroup.name}`
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
      const targetParents = this.getParent(group, this.groups)
      // 如果targetGroup为localGroup的子孙，报错
      if (targetParents.map(i => i._id).includes(this.localGroup._id)) {
        this.$message({type: 'warning', message: '迁移分组出现循环！'})
        return
      }
      this.targetGroup = group
    },
    onQuery (val) {
      this.query = val
    },
    handleClose () {
      this.moveToTop = false
      this.localGroup = {}
      this.targetGroup = {}
      this.query = ''
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
      if (!this.moveToTop && !this.targetGroup._id) {
        this.$message({type: 'warning', message: '请选择待迁移到的分组'})
        return
      }
      this.moveToTop ? this.localGroup.pGroup = null : this.localGroup.pGroup = this.targetGroup._id
      this.$store.dispatch('updateGroup', this.localGroup).then(rs => {
        this.$message.success({type: 'success', message: '迁移成功'})
        this.$emit('update', rs.data)
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
