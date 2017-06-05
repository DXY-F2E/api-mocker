<template>
    <el-card class="card-box" @click.native="editApi(data)">
      <div slot="header" class="clearfix">
        <span class="name">{{data.name}}</span>
        <el-button-group>
          <!-- <copy-button size="mini" icon="document" :copy-data="copyData" message="复制接口链接成功"></copy-button> -->
          <el-button size="mini" icon="document" @click.native.stop="showDoc()"></el-button>
          <el-button size="mini" icon="delete" @click.native.stop="deleteApi()"></el-button>
        </el-button-group>
        <!-- <el-button type="primary" icon="edit" size="small" class="edit-api"></el-button> -->
      </div>
      <div class="text item">
          <label>Method:</label>{{data.options.method}}
      </div>
      <div class="text item">
          <label>Creator:</label><input v-model="creator" readonly :id="data._id" />
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
        url() {
            return `/client/${this.data._id}`;
            // return this.data.prodUrl ? || '无';
        },
        creator() {
            return this.data.creator ? this.data.creator.name : '未知';
        }
    },
    data() {
        return {
            copyData: this.$store.state.serverRoot + this.url
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
        },
        confirmDelete() {
            this.$store.dispatch('deleteApi', {
                api: this.data,
                index: this.index
            }).then(() => {
                this.$message.success('删除成功');
            }).catch(err => {
                if (err.response && err.response.data) {
                    this.$message.error(err.response.data.message);
                } else {
                    this.$message.error(err);
                }
            });
        },
        deleteApi() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmDelete();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
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
}
.item input {
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    line-height: 1;
    line-height: 20px;
    height: 20px;
    max-width: 120px;
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
