<template>
  <div class="diff-doc">
    <div class="diff-control">
      <label>{{title}}</label>
      <div class="api-selector"
           v-if="apis.length">
        修改于：
        <el-select :value="api" @input="selectApi">
          <el-option v-for="api in apis"
                     :key="api.id"
                     :value="api"
                     :label="getApiLabel(api)"></el-option>
        </el-select>
      </div>
    </div>
    <api-doc :api="api"
             v-if="api"
             :diff-stack="diffStack"
             :diff-mode="diffMode"></api-doc>
    <div class="empty"
         v-else>无数据</div>
  </div>
</template>
<script>
import ApiDoc from '@/components/ApiDoc/Index'
import monent from 'moment'
export default {
  components: {
    ApiDoc
  },
  props: {
    title: {
      type: String,
      required: true
    },
    diffStack: {
      type: Object,
      required: false
    },
    diffMode: {
      type: Boolean,
      default: false
    },
    api: {
      type: Object,
      required: false
    },
    apis: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getApiLabel (api) {
      return monent(Number(api.modifiedTime)).format('YYYY-MM-DD HH:mm:ss')
    },
    selectApi (api) {
      this.$emit('selectApi', api)
    }
  }
}
</script>
<style lang="less">
.diff-doc {
  overflow: scroll;
  & > .empty {
    text-align: center;
    margin-top: 50px;
    font-size: 16px;
  }
}
.diff-control {
  padding: 20px 30px;
  border-bottom: 1px solid #ececec;
  label {
    font-size: 20px;
    height: 36px;
    line-height: 36px;
  }
  .api-selector {
    float: right;
  }
}
</style>
