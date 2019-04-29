<template>
  <ul class="history">
    <li class="record" v-for="record in records" :key="record._id" @click="recover(record)">
      <span class="time">{{record.data.modifiedTime | dateFormat('YYYY-MM-DD H:mm')}}</span>
      <span class="name">{{record.operatorName}}</span>
      <span class="recover">加载</span>
    </li>
  </ul>
</template>

<script>
import R from 'ramda'
import { mapState } from 'vuex'
export default {
  name: 'ApiHistory',
  computed: {
    ...mapState('doc', ['apiUnsaved', 'api']),
    history () {
      return this.api.history
    },
    records () {
      if (this.history && this.history.records.length) {
        return this.history.records.slice().reverse()
      } else {
        return []
      }
    }
  },
  methods: {
    recover (record) {
      if (this.apiUnsaved) {
        this.$confirm('当前有未保存的内容, 是否加载?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.recoverAct(record)
        })
      } else {
        this.recoverAct(record)
      }
    },
    recoverAct (record) {
      // 数组 slice 方法是浅复制，所以这里需要深拷贝一份
      const data = R.clone(record.data)
      data.history = this.history
      this.$store.commit('doc/UPDATE_API', data)
      // apiUnsaved -> false
      this.$store.commit('doc/SAVE_API')
      this.$message.info('加载成功，再保存将会覆盖最新值')
    }
  }
}
</script>
<style lang="less">
.history {
  padding: 0 20px;

  .record {
    color: #8492A6;
    line-height: 2.2;
    cursor: pointer;
    /*border-bottom: 1px solid #d1dbe5;*/
    &:hover {
      color: #475669;
    }
    .name {
      margin-left: 10px;
    }
    .recover {
      float: right;
      margin-left: 10px;
      display: none;
    }
    &:hover .recover {
      display: inline-block;
    }
  }
}
</style>
