<template>
  <div class="menu-nav">
    <el-menu :default-active="$route.params.groupId" class="el-menu-vertical" background-color="#eef1f6">
      <el-menu-item-group>
        <template slot="title">
          <div @click="handleClickGroup" class="title-text">组列表</div>
          <div class="title-actions">
            <search @query="onQuery"
                    v-model="query"
                    placeholder="请输入分组名称"
                    size="small">
            </search>
            <el-button size="small"
                       icon="el-icon-plus"
                       @click="handleClickShowDialog">
            </el-button>
          </div>
        </template>
        <el-menu-item v-for="group in groupList"
                      :index="group._id"
                      class="group-item"
                      @click="handleClickGroup(group)"
                      :key="group._id">
          <i class="el-icon-document" @click.stop="showGroupDoc(group)"></i>
          <span>{{group.name}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
    <create-group-dialog
      v-if="showCreateDialog"
      :visible.sync="showCreateDialog"
      @action="handleClickCreateGroup"
      @close="handleClickClose"/>
  </div>
</template>
<script>
import CreateGroupDialog from '@/components/common/CreateGroup'
import Search from './Search'
export default {
  components: {
    Search,
    CreateGroupDialog
  },
  computed: {
    groupList () {
      return this.$store.state.groups.filter(g => g.name.toLowerCase().indexOf(this.query.toLowerCase()) >= 0)
    }
  },
  data () {
    return {
      showCreateDialog: false,
      query: ''
    }
  },
  methods: {
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
    },
    showGroupDoc (group) {
      this.$router.push({
        name: 'GroupDoc',
        params: {
          groupId: group._id
        }
      })
    }
  }
}
</script>
<style lang="less">
.menu-nav {
  width: 288px;
  min-width: 288px;
  background-color: #eef1f6;

  .el-menu-item-group__title {
    padding: 15px 20px 0 20px;
    line-height: 30px;
    position: relative;

    & > i {
      position: relative;
      right: 0;
      margin: 0 3px;
      transform: rotate(0deg);
      transform-origin: 50% 50%;
      transition: transform .3s;
      cursor: pointer;
    }
  }

  .el-icon-plus:hover {
    transform: rotate(90deg);
  }

  .title-text {
    display: block;
    font-size: 16px;
    color: #333;
  }

  .title-actions {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      margin-left: 10px;
    }
  }

  .search {
    .el-input__inner {
      background-color: #F9FAFC;
    }
  }
}

.group-item {
  [class^=el-icon-].el-icon-document {
    display: inline-block;
    font-size: 18px;
    position: relative;
    top: 2px;
    visibility: hidden;
    margin-right: 4px;
  }

  &:hover .el-icon-document {
    visibility: visible;
  }
  & > * {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
