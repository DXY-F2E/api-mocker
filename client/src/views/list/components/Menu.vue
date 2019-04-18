<template>
  <div class="group-nav">
    <div class="group-top">
      <div class="actions">
        <search @query="onQuery"
                v-model="query"
                placeholder="请输入分组名称"
                size="small">
        </search>
        <el-button size="small" icon="el-icon-plus" @click="handleClickShowDialog"></el-button>
      </div>
    </div>
    <div class="group-list">
      <div class="block-title">
        我的收藏&nbsp;&nbsp;<small>{{ myGroupList.length }}</small>
      </div>
      <div v-for="group in myGroupList"
        class="group-item"
        @click="handleClickGroup(group)"
        :key="group._id">
        <div class="group-item-wrap">
          <div :class="[group._id === groupId ? 'active': '']">{{group.name}}</div>
          <el-rate :value="1" @click.native.stop="handleRemoveFavorite(group._id)" :max="1"></el-rate>
        </div>
      </div>
      <div class="block-title">更多分组</div>
      <div v-for="group in moreGroupList"
        class="group-item"
        @click="handleClickGroup(group)"
        :key="group._id">
        <div class="group-item-wrap">
          <div :class="[group._id === groupId ? 'active': '']">{{group.name}}</div>
          <el-rate @click.native.stop="handleAddFavorite(group._id)" :max="1"></el-rate>
        </div>
      </div>
    </div>
    <create-group-dialog
      v-if="showCreateDialog"
      :visible.sync="showCreateDialog"
      @action="handleClickCreateGroup"
      @close="handleClickClose"/>
  </div>
</template>
<script>
import CreateGroupDialog from '@/components/common/CreateGroup'
import Search from '@/components/common/SearchInput'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    Search,
    CreateGroupDialog
  },
  computed: {
    ...mapState(['user', 'groups']),
    // 收藏
    favorites () {
      return this.user.favorites
    },
    // 全部分组
    groupList () {
      return this.groups.filter(g => g.name.toLowerCase().indexOf(this.query.toLowerCase()) >= 0)
    },
    // 收藏的分组
    myGroupList () {
      return this.groupList.filter(item => this.favorites.includes(item._id))
    },
    // 更多分组
    moreGroupList () {
      return this.groupList.filter(item => !this.favorites.includes(item._id))
    },
    groupId () {
      return this.$route.params.groupId
    }
  },
  data () {
    return {
      showCreateDialog: false,
      query: ''
    }
  },
  methods: {
    ...mapActions([
      'addFavorite',
      'removeFavorite'
    ]),
    async handleAddFavorite (groupId) {
      // 添加到收藏夹
      try {
        await this.addFavorite(groupId)
        this.$message.success('收藏成功')
      } catch (err) {
        this.$message.error('收藏失败')
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
      this.showCreateDialog = true
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
  .group-item {
    margin: 0 -15px;
    padding: 10px 20px;
    padding-left: 20px;
    font-size: 15px;
    cursor: pointer;
    color: #303133;
    &:hover {
      background: #ddd;
    }
  }
  .group-item-wrap {
    .active {
      color: #409EFF;
    }
    display: flex;
    justify-content: space-between;
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
