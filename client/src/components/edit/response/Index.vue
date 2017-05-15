<template>
<el-row type="flex" class="out-box">
    <el-col class="status">
        <status :response="response"
                :active-index="activeIndex"
                @add="addResponse"
                @delete="deleteResponse"
                @change="changeSchema"></status>
    </el-col>
    <el-col class="schema-content">
        <schema :schema="response[activeIndex]" @change="updateResponse" :fullscreen="fullscreen"></schema>
    </el-col>
</el-row>
</template>

<script>
import Schema from '../schema/Index';
import Status from './Status';
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
.out-box .el-col {
    position: relative;
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

.schema-content {
    height: 300px;
    overflow-y: auto;
}
.fullscreen .schema-content{
    height: auto;
}
</style>
