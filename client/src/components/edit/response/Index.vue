<template>
<div class="out-box">
    <div class="hd">Response</div>
    <el-row type="flex">
        <el-col class="status">
            <status :response="response"
                    :active-index="activeIndex"
                    @add="addResponse"
                    @delete="deleteResponse"
                    @change="changeSchema"></status>
        </el-col>
        <el-col>
            <schema :schema="response[activeIndex]" @change="updateResponse"></schema>
        </el-col>
    </el-row>
</div>
</template>

<script>
import Schema from '../schema/Index';
import Status from './Status';
import R from 'ramda';
export default {
    props: ['response'],
    components: {
        Status,
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
        updateResponse(schema) {
            const key = `options.response.${this.activeIndex}`;
            this.$store.commit('UPDATE_API_PROPS',
                               [key, R.clone(schema)]);
        }
    }
};
</script>
<style>
.out-box {
    /*border-left: 1px solid #d1dbe5;*/
    /*border-right: 1px solid #d1dbe5;*/
}
.out-box > .el-row{
    /*height: 300px;*/
}
.out-box .el-col.status {
    position: relative;
    min-width: 150px;
    max-width: 150px;
    height: 100%;
}
.out-box .schema {
    border-left: 1px solid #d1dbe5;
    /*margin-left: -1px;*/
}
</style>
