<template>
<div class="response-box">
    <!-- <config></config> -->
    <el-row type="flex" class="out-box">
        <el-col class="status">
            <status :response="response"
                    :active-index="activeIndex"
                    @add="addResponse"
                    @delete="deleteResponse"
                    @change="changeSchema"></status>
        </el-col>
        <el-col class="schema-content">
            <schema :schema="response[activeIndex]" @change="updateResponse" :fullscreen="fullscreen">
                <el-tab-pane class="tab-item" label="Status" name="status">
                    <status-setting :schema="response[activeIndex]" @change="updateStatus"></status-setting>
                </el-tab-pane>
            </schema>
        </el-col>
    </el-row>
</div>
</template>

<script>
import Schema from '../schema/Index';
import Status from './Status';
import StatusSetting from './StatusSetting';
import Config from './Config';
import R from 'ramda';
export default {
    props: {
        response: {
            type: Array,
            required: true
        },
        fullscreen: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Config,
        Status,
        StatusSetting,
        Schema
    },
    data() {
        return {
            activeIndex: 0
        };
    },
    methods: {
        changeSchema(index) {
            this.activeIndex = index;
        },
        deleteResponse(index) {
            this.$store.commit('DELETE_API_RESPONSE', index);
            if (this.activeIndex !== 0) {
                this.activeIndex --;
            }
        },
        addResponse() {
            this.$store.commit('ADD_API_RESPONSE');
            this.activeIndex = this.response.length - 1;
        },
        updateStatus({ status, statusText}) {
            const schema = R.clone(this.response[this.activeIndex]);
            schema.status = status;
            schema.statusText = statusText;
            this.updateResponse(schema);
        },
        updateResponse(schema) {
            const key = `options.response.${this.activeIndex}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [key, schema]);
        }
    }
};
</script>
<style>
.out-box .el-col {
    position: relative;
}
.out-box .el-col.status {
    position: relative;
    min-width: 150px;
    max-width: 150px;
    height: 100%;
}
.schema-content {
    height: 300px;
    overflow-y: auto;
}
.fullscreen .out-box {
    position: absolute;
    top: 57px;
    bottom: 0;
    left: 0;
    right: 0;
}
.fullscreen .schema-content{
    height: auto;
}
</style>
