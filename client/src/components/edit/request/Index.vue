<template>
    <div class="request-box">
        <el-tabs v-model="requestActive">
            <el-tab-pane v-for="(type, key) in types"
                         :key="type.name"
                         :label="type.label"
                         :name="type.name"
                         :disabled="method === 'get' && type.name === 'query'">
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
    methods: {
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
            }],
            localParams: clone(this.params)
        };
    },
    computed: {
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
.request-box .el-tabs__content {
    overflow: visible;
    padding-left: 10px;
}
</style>
