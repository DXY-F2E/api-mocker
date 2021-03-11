<template>
  <div class="group-nav">
    <div class="group-top">
      <div class="actions">
        <search @query="onQuery"
                v-model="query"
                placeholder="请输入分组名称"
                size="small">
        </search>
      </div>
    </div>
    <div class="group-list">
      <div class="block-title">
        我的收藏&nbsp;&nbsp;
      </div>
      <div v-for="group in myGroupList"
        class="group-item collection"
        :key="group._id">
        <div @click="handleClickGroup(group)" class="group-item-wrap">
          <div :class="[group._id === groupId ? 'active': '']">{{getGroupParentName(group)}}{{ getGroupParentName(group) ? ' / ' : '' }}<span class="group-name">{{ group.name }}</span></div>
          <el-rate :value="1" @click.native.stop="handleRemoveFavorite(group._id)" :max="1"></el-rate>
        </div>
        <el-dropdown @command="handleGroupClick($event, group)">
          <i class="el-icon-more-outline more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="addApi">添加API</el-dropdown-item>
            <el-dropdown-item v-if="user._id === group.creator" command="edit">编辑分组</el-dropdown-item>
            <el-dropdown-item command="addSub">添加子分组</el-dropdown-item>
            <el-dropdown-item v-if="user._id === group.creator" command="move">迁移分组</el-dropdown-item>
            <el-dropdown-item v-if="user._id === group.creator" command="moveApi">迁移组内API</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <hr />
      <div class="block-title-container">
        <div class="block-title">全部分组</div>
        <el-button size="small" icon="el-icon-plus" @click="handleClickShowDialog"></el-button>
      </div>
      <div>
      <el-tree
      :data="moreGroupList"
      default-expand-all
      node-key="_id"
      :expand-on-click-node="false">
      <div class="group-item" slot-scope="{ data }">
        <div @click="handleClickGroup(data)" class="group-item-wrap">
          <div :class="[data._id === groupId ? 'active': '']">{{data.name}}</div>
          <el-rate :value="favorites.includes(data._id) ? 1 : 0" @click.native.stop="handleChangeFavorite(data._id, favorites.includes(data._id))" :max="1"></el-rate>
        </div>
        <el-dropdown @command="handleGroupClick($event, data)">
          <i class="el-icon-more-outline more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="addApi">添加API</el-dropdown-item>
            <el-dropdown-item v-if="user._id === data.creator" command="edit">编辑分组</el-dropdown-item>
            <el-dropdown-item command="addSub">添加子分组</el-dropdown-item>
            <el-dropdown-item v-if="user._id === data.creator" command="move">迁移分组</el-dropdown-item>
            <el-dropdown-item v-if="user._id === data.creator" command="moveApi">迁移组内API</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-tree>
      </div>
    </div>
    <group-edit
      v-if="group || pGroup"
      :pGroup="pGroup"
      :group="group"
      :visible="showGroupEdit"
      @hide="showGroupEdit = false"
    ></group-edit>
    <move-dialog
      v-if="moveGroup"
      :group="moveGroup"
      :visible="showMoveDialog"
      @hide="showMoveDialog = false"
    ></move-dialog>
    <move-api-dialog
      v-if="moveGroup"
      :group="moveGroup"
      :visible="showMoveApiDialog"
      @hide="showMoveApiDialog = false"
    ></move-api-dialog>
  </div>
</template>
<script>
import Search from '@/components/common/SearchInput'
import { mapActions, mapState, mapMutations } from 'vuex'
import GroupEdit from '@/views/manage/group/GroupEdit'
import MoveDialog from './MoveDialog'
import MoveApiDialog from './MoveApiDialog'

export default {
  components: {
    Search,
    GroupEdit,
    MoveDialog,
    MoveApiDialog
  },
  computed: {
    ...mapState(['user', 'groups']),
    // 收藏
    favorites () {
      return this.user.favorites || []
    },
    // 全部分组
    groupList () {
      return this.groups.filter(g => g.name.toLowerCase().indexOf(this.query.toLowerCase()) >= 0)
    },
    // 收藏的分组
    myGroupList () {
      const groups = this.groupList.filter(item => this.favorites.includes(item._id))
      groups.forEach(g => {
        g.parents = this.getParent(g, this.groups)
      })
      return groups
    },
    // 更多分组
    moreGroupList () {
      // this.groups转成树形结构
      const tree = this.getTree(this.groups)
      return this.getFilterTree(tree, this.query)
    },
    groupId () {
      return this.$route.params.groupId
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      moveGroup: null,
      showMoveDialog: false,
      showMoveApiDialog: false,
      pGroup: {},
      showCreateDialog: false,
      query: '',
      group: {},
      showGroupEdit: false
    }
  },
  methods: {
    ...mapMutations(['SET_CUR_GROUP']),
    ...mapActions([
      'addFavorite',
      'removeFavorite'
    ]),
    getGroupParentName (group) {
      const name = `${group.parents.map(g => g.name).join(' / ')}`
      return name.startsWith(' /') ? name.substr(3, name.length) : name
    },
    updateGroup (group) {
      this.getMyGroups()
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
    getChildren (g, groups) {
      g.children = groups.filter(i => i.pGroup === g._id)
      g.children.forEach((g) => {
        this.getChildren(g, groups)
      })
    },
    handleGroupClick (command, group) {
      switch (command) {
        case 'addSub': {
          this.showGroupEdit = true
          this.pGroup = group
          this.group = {}
          break
        }
        case 'edit': {
          this.showGroupEdit = true
          this.group = group
          this.pGroup = {}
          break
        }
        case 'addApi': {
          const query = `?groupId=${group._id}`
          this.$router.push(`/create${query}`)
          break
        }
        case 'move': {
          this.showMoveDialog = true
          this.moveGroup = group
          break
        }
        case 'moveApi': {
          this.showMoveApiDialog = true
          this.moveGroup = group
          break
        }
        default: {

        }
      }
    },
    async handleChangeFavorite (groupId, hasFovor) {
      // 添加到收藏夹
      try {
        if (hasFovor) {
          await this.removeFavorite(groupId)
        } else {
          await this.addFavorite(groupId)
        }
        this.$message.success('操作成功')
      } catch (err) {
        this.$message.error('操作失败')
      }
    },
    async handleRemoveFavorite (groupId) {
      // 添加到收藏夹
      try {
        await this.removeFavorite(groupId)
        this.$message.success('取消收藏成功')
      } catch (err) {
        this.$message.error('取消收藏失败')
      }
    },
    onQuery (val) {
      this.query = val
    },
    handleClickGroup (group) {
      this.SET_CUR_GROUP(group)
      if (group && group._id) {
        this.$router.replace(`/list/${group._id}`)
      } else {
        this.$router.replace('/')
      }
    },
    handleClickCreateGroup (groupName) {
      this.$store.dispatch('createGroup', { name: groupName }).then(() => {
        this.showCreateDialog = false
      }).catch(e => this.$message.error(e.msg))
    },
    handleClickClose () {
      this.showCreateDialog = false
    },
    handleClickShowDialog () {
      this.showGroupEdit = true
      this.pGroup = {}
      this.group = {}
    }
  }
}
</script>
<style lang="less">
.group-top {
  margin-top: 15px;
}

.group-nav {
  padding: 0 15px;
}

.group-list {
  /deep/ .el-tree-node__content {
    height: auto;
  }
  /deep/ .el-tree-node {
    white-space: normal;
  }
  .group-item {
    flex: 1;
    display: flex;
    margin: 0 -15px;
    padding-left: 20px;
    font-size: 15px;
    color: #303133;
    &.collection {
      .group-item-wrap {
        padding-left: 10px;
      }
      &:hover {
        cursor: pointer;
        background-color: #fff;
      }
    }
    .more {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 20px;
      padding: 10px;
      margin-right: 16px;
      &:hover {
        background-color: lightgray;
        cursor: pointer;
      }
    }
  }
  .group-item-wrap {
    align-items: center;
    &:hover {
      // background: #ddd;
    }
    padding: 10px 0px;
    flex: 1;
    .active {
      color: #409EFF;
    }
    display: flex;
    justify-content: space-between;
  }
}
.block-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 50%;
  }
}

.block-title {
    display: block;
    font-size: 16px;
    font-weight: bold;
    color: #606266;
    margin: 10px 0;
    small {
      color: #909399;
    }
  }

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    margin-left: 10px;
  }
}
</style>
