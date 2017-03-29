<template>
    <el-card class="card-box" @click.native="editApi(data)">
      <div slot="header" class="clearfix">
        <span class="name">{{data.name}}</span>
        <el-button-group>
          <el-button size="mini" icon="document" @click.native.stop="copy()"></el-button>
          <el-button size="mini" icon="delete" @click.native.stop="deleteApi()"></el-button>
        </el-button-group>
        <!-- <el-button type="primary" icon="edit" size="small" class="edit-api"></el-button> -->
      </div>
      <div class="text item">
          <label>URL:</label><input v-model="data.url" readonly :id="data._id" />
      </div>
      <div class="text item">
          <label>Method:</label>{{data.options.method}}
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
    },
    methods: {
        editApi(api) {
            this.$store.commit('UPDATE_API', api);
            this.$router.push(`/edit/${api.group}/${api._id}`);
        },
        copy() {
            const input = document.getElementById(this.data._id);
            input.select();
            document.execCommand('copy');
            input.blur();
            this.$message.success('复制接口链接成功');
        },
        deleteApi() {
            window.console.log(this.data._id);
        }
    }
};
</script>
<style>
.el-card {
    cursor: pointer;
    transition: all 0.2s ease;
    width: 219px;
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
.item {
    color: #8492A6;
}
.item label {
    color: #475669;
    margin-right: 5px;
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
.card-box .clearfix {
    height: 22px;
    line-height: 22px;
}
.card-box .name {
    width: 140px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.card-box .el-button-group {
    float: right;
    margin-right: -10px;
    display: none;
}
.card-box:hover .el-button-group {
    display: inline-block;
}
.card-box .el-button-group .el-button:focus,
.card-box .el-button-group button {
    background-color: #F9FAFC;
    color: #8492A6;
    border-color: #bfcbd9;
}
.card-box .el-button-group .el-button:hover {
    /*border-color: #E5E9F2;*/
    background-color: #E5E9F2;
    color: #475669;
}
</style>
