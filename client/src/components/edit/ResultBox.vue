<template>
<div class="result-box">
    <json-editor id="json-editor"
                 v-model="jsonData"
                 name="返回数据"
                 @change="jsonChanged"></json-editor>
</div>
</template>

<script>
import JsonEditor from '../common/jsonEditor/Index';
export default {
    components: {
        JsonEditor
    },
    data() {
        return {
            resActive: 'body'
        };
    },
    computed: {
        jsonData() {
            return this.getResponseData();
        },
        response() {
            return this.$store.state.response;
        }
    },
    methods: {
        jsonChanged(data) {
            window.console.log(data);
        },
        getResponseData() {
            if (this.resActive === 'body') {
                return this.response.data;
            } else if (this.resActive === 'header') {
                return Object.assign({
                    status: this.response.status,
                    statusText: this.response.statusText
                }, this.response.headers);
            } else {
                return this.response;
            }
        }
    }
};
</script>
<style>
.result-box {
    height: 300px;
}
</style>
