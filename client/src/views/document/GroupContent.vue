<template>
  <div ref="apiDoc" class="apis-doc" v-if="group">
    <div class="title">
      {{getGroupName(group)}}接口文档
      <div class="control">
        <el-button class="follow"
                    icon="el-icon-star-on"
                    v-if="followed"
                    type="primary"
                    @click="unfollowGroup(group._id)">取消订阅</el-button>
        <el-button class="follow"
                    icon="el-icon-star-off"
                    v-else
                    @click="followGroup(group._id)">订阅</el-button>
      </div>
      <div style="font-size: 14px; color: black;">当前api组管理员：{{groupDetail.managerName}}</div>
    </div>
    <div class="tip-container">
      <h3>小贴士</h3>
      <div class="detail">
        <div>当前接口分组hash为<strong>{{group._id}}</strong>，则组内接口mock地址前缀均为 <strong>{{urlJoin(this.serverRoot, '/client', group._id)}}</strong>，可作为组内接口通用的baseUrl（未配置接口路径的api无法使用该前缀）</div>
        <div>如当api配置了接口路径为/api/login时，则mock地址为{{urlJoin(this.serverRoot, 'client', group._id, 'api/login')}}</div>
      </div>
    </div>
    <api-doc :api="api" v-for="api in apiList" :key="api._id" @reload="reload"></api-doc>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next, jumper" @current-change="getApis"
        :current-page.sync="query.page" :page-size="query.limit" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import API from '@/config/api'
import ApiDoc from '@/components/ApiDoc/Index'
import { mapActions, mapState } from 'vuex'
import { urlJoin } from '@/util'
export default {
  components: {
    ApiDoc
  },
  props: ['groupId'],
  data () {
    return {
      query: { limit: 10, page: 1, order: { name: 1 } },
      total: 0,
      apiList: []
    }
  },
  computed: {
    ...mapState(['serverRoot', 'groups', 'groupDetail']),
    group () {
      return this.$store.state.groups.find(g => g._id === this.groupId)
    },
    user () {
      return this.$store.state.user
    },
    followed () {
      return !!this.group.follower.find(f => f === this.user._id)
    }
  },
  created () {
    this.getApis()
  },
  watch: {
    groupId () {
      this.getApis()
    }
  },
  methods: {
    ...mapActions([
      'followGroup',
      'unfollowGroup'
    ]),
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
    urlJoin (...args) {
      return urlJoin(...args)
    },
    getApis () {
      this.$http.get(API.GROUP_APIS.replace(':groupId', this.groupId), {
        params: this.query
      }).then(rs => {
        this.apiList = rs.data.resources
        this.total = rs.data.pages.count
        this.$refs.apiDoc && this.$refs.apiDoc.scrollTo(0, 0)
      })
    },
    reload () {
      this.$emit('reload')
      this.getApis()
    }
  }
}
</script>
<style lang="less">
.tip-container {
  padding: 0 30px 30px;
  margin: 20px 0 30px;
  border-bottom: 1px solid #ddd;
  .detail {
    margin-left: 10px;
    color: #5e6d82;
    div:first-child {
      margin: 10px 0;
    }
  }
}
.apis-doc > .title {
  padding: 30px;
  font-size: 28px;
  border-bottom: 1px solid #ddd;

  .control {
    float: right;
  }
}
</style>
