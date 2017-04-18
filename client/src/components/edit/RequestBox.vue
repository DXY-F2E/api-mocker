<template>
    <div class="request-box">
        <el-tabs v-model="requestActive">
            <el-tab-pane label="Body" name="body" :disabled="method === 'get'">
                <params :data="params.body" name="body"></params>
            </el-tab-pane>
            <el-tab-pane label="Query" name="query">
                <params :data="params.query" name="query"></params>
            </el-tab-pane>
            <el-tab-pane label="Advanced" name="advanced" v-if="mode === 'edit'">
                <advanced></advanced>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Params from './Params';
import ReqBody from './Body';
import Advanced from './Advanced';
export default {
    components: {
        Params,
        Advanced,
        ReqBody
    },
    props: ['mode', 'params', 'method'],
    methods: {
        getReqActive() {
            if (this.method === 'get' || this.method === 'delete') {
                return 'query';
            } else {
                return 'body';
            }
        }
    },
    watch: {
        mode(val) {
            if (val === 'test' && this.requestActive === 'advanced') {
                this.requestActive = this.getReqActive();
            }
        }
    },
    data() {
        return {
            requestActive: this.getReqActive()
        };
    }
};
</script>
<style>
.request-box .el-select .el-input {
    width: 100px;
}
.request-box .key {
    max-width: 500px;
}
.request-box .config {
    min-width: 200px;
    max-width: 200px;
}
.request-box .control {
    min-width: 120px;
    max-width: 120px;
}
.request-box .control i {
    color: #ccc;
    line-height: 36px;
    width: 36px;
    cursor: pointer;
    float: left;
    text-align: center;
}
.request-box .control i:hover {
    background-color: #EFF2F7;
}
.request-box .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #EFF2F7;
}
.request-box .el-input-number {
    width: 100%;
}
.request-box .el-select {
    margin-right: 20px;
}
.request-box .fill .name {
    min-width: 140px;
    /*max-width: 300px;*/
    padding-left: 10px;
    margin-right: 10px;
}
.request-box .fill .name label {
    display: block;
    line-height: 36px;
    height: 36px;
    border-bottom: 1px solid #EFF2F7;
}
.test .set,
.edit .fill {
    display: none;
}
.request-box code {
    color: #e96900;
    margin: 0 2px;
    border-radius: 2px;
    white-space: nowrap;
}
</style>
