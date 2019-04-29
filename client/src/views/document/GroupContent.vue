<template>
  <div class="apis-doc" v-if="group">
    <div class="title">
      {{group.name}}接口文档
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
    </div>
    <api-doc :api="api" v-for="api in apis" :key="api._id"></api-doc>
  </div>
</template>

<script>
import ApiDoc from '@/components/ApiDoc/Index'
import { mapActions } from 'vuex'
export default {
  components: {
    ApiDoc
  },
  props: ['apis'],
  computed: {
    group () {
      return this.$store.state.groups.find(g => g._id === this.$route.params.groupId)
    },
    user () {
      return this.$store.state.user
    },
    followed () {
      return !!this.group.follower.find(f => f === this.user._id)
    }
  },
  methods: {
    ...mapActions([
      'followGroup',
      'unfollowGroup'
    ])
  }
}
</script>
<style lang="less">
.apis-doc > .title {
  padding: 30px;
  font-size: 28px;
  border-bottom: 1px solid #ddd;

  .control {
    float: right;
  }
}
</style>
