<template>
  <div class="manage-api">
    <el-row type="flex" justify="space-between">
      <el-col :span="20"><div class="title">我创建的 API</div></el-col>
      <el-col :span="4"><SearchInput @query="onQuery" :size="'small'" :placeholder="'搜索接口'"/></el-col>
    </el-row>

    <api-manage :apis="apis" :count="count" @reload="getdata"></api-manage>
    <div class="pagination">
      <Pagination :total="count" :query="query" @change="change"/>
    </div>
  </div>
</template>

<script>
import ApiManage from './ApiManage'
import { mapActions } from 'vuex'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
export default {
  components: {
    ApiManage,
    Pagination,
    SearchInput
  },
  data () {
    return {
      apis: [],
      query: {
        q: '',
        page: 1,
        limit: 16
      },
      count: 0,
      sendQueryCount: 0,
      receiveQueryCount: 0
    }
  },
  computed: {
    total () {
      return this.apis.length
    },
    groups () {
      return this.$store.state.groups
    },
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    ...mapActions(['getManageApi']),
    change (page) {
      this.query.page = page
      this.getdata()
    },
    async getdata () {
      let query = this.query
      await this.getManageApi(query).then(v => {
        this.apis = v.data.results
        this.count = v.data.count
      })
    },
    checkInGroup (val) {
      let _val = val
      if (!this.user.isManager) {
        for (let i = 0; i < this.groups.length; i++) { // 如果搜索的名称就是组的名称，优先认为在搜索组
          if (this.groups[i].name === val && this.user.id === this.groups[i].creator) {
            _val = this.groups[i]._id
            break
          }
        }
      } else {
        for (let i = 0; i < this.groups.length; i++) { // 超管不需要
          if (this.groups[i].name === val) {
            _val = this.groups[i]._id
            break
          }
        }
      }
      return _val
    },
    async onQuery (val) {
      this.query.q = this.checkInGroup(val)
      this.query.page = 1
      let query = this.query
      this.sendQueryCount++
      await this.getManageApi(query).then(v => { // 网络防抖
        this.receiveQueryCount++
        if (this.sendQueryCount === this.receiveQueryCount) {
          this.apis = v.data.results
          this.count = v.data.count
        }
      }).catch(e => {
        this.receiveQueryCount++
      })
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 20px;
  margin: 20px 0;
}
</style>
