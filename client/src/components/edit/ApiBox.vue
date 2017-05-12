<template>
    <div class="api-box el-col">
        <url-box></url-box>
        <request-box :params="params" :method="method" :mode="mode"></request-box>
        <response v-if="response" :response="response"></response>
        <mock-box :params="params" :mode="mode"></mock-box>
        <desc-box></desc-box>
    </div>
</template>

<script>
import RequestBox from './request/Index';
import MockBox from './MockBox';
import UrlBox from './UrlBox';
import Response from './response/Index';
import DescBox from './DescBox';
export default {
    components: {
        RequestBox,
        Response,
        MockBox,
        DescBox,
        UrlBox
    },
    computed: {
        mode() {
            return this.$store.state.mode;
        },
        params() {
            return this.$store.state.api.options.params;
        },
        response() {
            return this.$store.state.api.options.response;
        },
        method() {
            return this.$store.state.api.options.method;
        }
    }
};
</script>
<style>
.api-box {
    padding: 20px;
}
.api-box > div {
    /*margin-top: 20px;*/
}
.api-box > div > .hd {
    text-align: left;
    border-top: 1px solid #D3DCE6;
    border-bottom: 1px solid #D3DCE6;
    line-height: 36px;
    font-size: 16px;
    color: #C0CCDA;
    /*padding: 8px 0;*/
    line-height: 40px;
}
</style>
