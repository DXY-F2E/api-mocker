<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{data.name}}</span>
        <!-- <el-button type="primary" icon="edit" size="small" class="edit-api"></el-button> -->
      </div>
      <div class="text item">
          <label>地址：</label><input v-model="data.url" readonly />
      </div>
      <div class="text item">
          <label>作者：</label>{{data.author}}
      </div>
    </el-card>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            require: true
        }
    }
};
</script>
<style>
.el-card {
    cursor: pointer;
    transition: all 0.2s ease;
    width: 238px;
    overflow: hidden;
}
.el-card:hover {
    background-color: #F9FAFC;
}
.edit-api {
    float: right;
    position: relative;
    top: -4px;
}
.el-card .el-card__body {
    padding: 15px 20px;
}
.el-card .el-card__header {
    padding: 8px 20px;
    /*line-height: 50px;*/
}
.el-card .el-card__header > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.item {
    color: #8492A6;
}
.item label {
    color: #475669;
}
.item input {
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    line-height: 2;
    height: 20px;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
