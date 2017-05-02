<template>
    <div class="request-box">
        <el-tabs v-model="requestActive">
            <el-tab-pane label="Body" name="body" :disabled="method === 'get'">
                <params :data="localParams.body" name="body" v-on:updateParams="(data) => changeParams(data, 'body')"></params>
            </el-tab-pane>
            <el-tab-pane label="Query" name="query">
                <params :data="localParams.query" name="query"></params>
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
import { clone } from '../../../util';
export default {
    components: {
        Params,
        Advanced,
        ReqBody
    },
    methods: {
        changeParams(data, name) {
            window.console.log(data);
            const key = `options.params.${name}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [key, clone(data)]);
        }
    },
    props: ['mode', 'params', 'method'],
    data() {
        return {
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
}
</style>
