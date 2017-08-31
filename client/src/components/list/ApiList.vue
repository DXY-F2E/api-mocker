<template>
  <div class="api-list-box">
    <ul class="api-list" v-loading="apiListLoading">
      <li v-for="api in apiList" :key="api.id">
        <api :data="api"></api>
      </li>
      <template v-if="groupId">
        <li class="add-api" @click="createApi">
          <el-card><i class="el-icon-plus"></i>创建接口</el-card>
        </li>
        <li class="add-api">
          <el-card>
            <import-rap-json :group="group"></import-rap-json>
          </el-card>
        </li>
      </template>
      <li class="empty">暂无接口</li>
    </ul>
  </div>
</template>

<script>
import Api from './Api'
import { mapState } from 'vuex'
import ImportRapJson from '../common/importJson/FromRap'

export default {
  components: {
    Api,
    ImportRapJson
  },
  computed: {
    ...mapState(['apiList', 'apiListLoading', 'groups']),
    groupId () {
      return this.$route.params.groupId
    },
    group () {
      return this.groups.find(g => g._id === this.groupId) || {}
    }
  },
  methods: {
    createApi () {
      const query = this.groupId ? `?groupId=${this.groupId}` : ''
      this.$router.push(`/create${query}`)
    }
  }
}
</script>
<style lang='less'>
.api-list {
  min-height: 100%;
  overflow: hidden;
}
.api-list > li {
  float: left;
  display: inline-block;
  margin: 10px;

  &.empty {
    color: #D3DCE6;
    text-align: center;
    display: block;
    margin: 0;
    padding-top: 100px;
    width: 100%;
  }
}
.api-list > li ~li.empty {
  display: none;
}
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

</style>
