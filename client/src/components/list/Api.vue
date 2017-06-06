<template>
    <el-card class="card-box" @click.native="editApi(data)">
      <div slot="header" class="clearfix">
        <span class="name">{{data.name}}</span>
        <el-button-group>
          <el-button size="mini" icon="document" @click.native.stop="showDoc()"></el-button>
          <copy-button size="mini" icon="share" :copy-data="apiUrl" message="复制接口链接成功"></copy-button>
          <!-- <el-button size="mini" icon="delete" @click.native.stop="deleteApi()"></el-button> -->
        </el-button-group>
      </div>
      <div class="text item">
          <label class="manager"><code>Manager:</code></label><input v-model="manager" readonly :id="data._id" />
      </div>
      <div class="text item">
          <label><code>Method :</code></label>{{data.options.method}}
      </div>
    </el-card>
</template>
<script>
import CopyButton from '../common/CopyButton';
export default {
    components: {
        CopyButton
    },
    props: {
        data: {
            type: Object,
            require: true
        },
        index: {
            type: Number,
            require: true
        }
    },
    computed: {
        manager() {
            return this.data.manager ? this.data.manager.name : '未知';
        }
    },
    data() {
        return {
            apiUrl: `${this.$store.state.serverRoot}/client/${this.data._id}`
        };
    },
    methods: {
        showDoc() {
            this.$router.push(`/doc/${this.data.group}/${this.data._id}`);
        },
        editApi(api) {
            this.$store.commit('UPDATE_API', api);
            this.$store.commit('CHANGE_MODE', 'edit');
            this.$router.push(`/edit/${api.group}/${api._id}`);
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
    /*line-height: 1.5;*/
    /*margin-bottom: 5px;*/
}
.item label {
    color: #475669;
    margin-right: 5px;
    width: 70px;
    display: inline-block;
    /*text-align: right;*/
}
.item input {
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    line-height: 1;
    line-height: 20px;
    height: 20px;
    max-width: 100px;
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
    cursor: pointer;
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
