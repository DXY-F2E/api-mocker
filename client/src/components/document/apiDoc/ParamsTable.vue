<template>
  <div class="params-table">
    <div class="hd">
      <el-row type="flex">
        <el-col class="key">参数名</el-col>
        <div class="row-and-col">
          <el-col class="type">类型</el-col>
          <el-col class="required">是否必填</el-col>
          <el-col class="comment">备注</el-col>
          <el-col class="example">示例</el-col>
        </div>
      </el-row>
    </div>
    <div class="bd">
      <params :params="params" :level="0"></params>
    </div>
  </div>
</template>

<script>
import Params from './Params'
export default {
  components: {
    Params
  },
  props: ['params']
}
</script>
<style lang="less">
.params-table {
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  overflow: hidden;

  .hd {
    background-color: #f8f8f8;
  }
  .el-row {
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    margin: -1px 0;

    .row-and-col {
      display: flex;
      width: 100%;
      flex: 8;
    }
  }
  .el-row:hover {
    background-color: #f8f8f8;
  }
}

.params-table .el-col {
  word-break: break-all;
  border-right: 1px solid #e6e6e6;
  padding: 8px 15px;
  min-width: 87px;

  &.el-col-24 {
    width: auto;
  }
  &:last-child {
    border: none;
  }
  &.key {
    flex: 2;
  }
  &.comment {
    min-width: 220px;
    max-width: 220px;
  }
  &.example {
    width: 100%;
  }
  &.type {
    min-width: 130px;
    max-width: 130px;
    text-align: center;
  }
  &.required {
    min-width: 100px;
    max-width: 100px;
    text-align: center;
  }
}
</style>
