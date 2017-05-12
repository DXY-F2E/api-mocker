<template>
    <div class="request-box">
        <el-tabs v-model="requestActive">
            <el-tab-pane v-for="(type, key) in types"
                         :key="type.name"
                         :label="type.label"
                         :name="type.name"
                         :disabled="method === 'get' && type.name === 'body'">
                <params-box :params="localParams[type.name]" :name="type.name"></params-box>
                <!-- <params :params="localParams[type.name]" :name="type.name"></params> -->
            </el-tab-pane>
            <el-tab-pane label="Advanced" name="advanced" v-if="mode === 'edit'">
                <advanced></advanced>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ParamsBox from './ParamsBox';
import ReqBody from './Body';
import Advanced from './Advanced';
import { clone } from '../../../util';
export default {
    components: {
        ParamsBox,
        Advanced,
        ReqBody
    },
    props: ['mode', 'params', 'method'],
    data() {
        return {
            types: [{
                label: 'Body',
                name: 'body'
            }, {
                label: 'Query',
                name: 'query'
            }]
        };
    },
    computed: {
        localParams() {
            return clone(this.params);
        },
        requestActive() {
            if (this.method === 'get' || this.method === 'delete') {
                return 'query';
            } else {
                return 'body';
            }
        }
    }
};
</script>
<style>
.request-box {
    margin-top: 20px;
}
.request-box .el-tabs__header {
    margin-bottom: 0;
}
.request-box .el-tabs__content {
    overflow: visible;
    margin: 15px 10px 20px 10px;
    /*border-top: 1px solid #eee;*/
    /*border-bottom: 1px solid #eee;*/
}
.request-box .el-tabs__content .el-tab-pane {
    margin-bottom: -1px;
}
</style>
