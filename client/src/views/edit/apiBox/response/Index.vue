<template>
  <el-row type="flex" class="out-box">
    <el-col class="status">
      <status
        :response="response"
        :active-index="activeIndex"
        @add="addResponse"
        @delete="deleteResponse"
        @change="changeSchema"
      ></status>
    </el-col>
    <el-col class="schema-content">
      <schema :schema="response[activeIndex]" :fullscreen="fullscreen" @change="updateResponse">
        <el-tab-pane class="tab-item" label="Status" name="status">
          <status-setting :schema="response[activeIndex]" @change="updateStatus"></status-setting>
        </el-tab-pane>
      </schema>
    </el-col>
  </el-row>
</template>

<script>
import R from 'ramda'
import Schema from '../schema/Index'
import Status from './Status'
import StatusSetting from './StatusSetting'

export default {
  props: {
    response: {
      type: Array,
      required: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Status,
    StatusSetting,
    Schema
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  methods: {
    changeSchema (index) {
      this.activeIndex = index
    },
    deleteResponse (index) {
      this.$store.commit('doc/DELETE_API_RESPONSE', index)
      if (this.activeIndex !== 0) {
        this.activeIndex --
      }
    },
    addResponse (copy = false) {
      let index = copy ? this.activeIndex : -1
      this.$store.commit('doc/ADD_API_RESPONSE', index)
      this.activeIndex = this.response.length - 1
    },
    updateStatus ({ status, statusText }) {
      const schema = R.clone(this.response[this.activeIndex])
      schema.status = status
      schema.statusText = statusText
      this.updateResponse(schema)
    },
    updateResponse (schema) {
      const key = `options.response.${this.activeIndex}`
      this.$store.commit('doc/UPDATE_API_PROPS', [key, R.clone(schema)])
    }
  }
}
</script>
<style lang="less">
.out-box {
  height: 300px;

  .el-col {
    position: relative;
  }
  .el-col.status {
    position: relative;
    min-width: 150px;
    max-width: 150px;
    height: 100%;
    overflow-y: auto;
  }
}
.fullscreen {
  .out-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .schema-content {
    height: auto;
  }
}
</style>
