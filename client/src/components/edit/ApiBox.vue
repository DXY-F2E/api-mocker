<template>
    <div class="api-box el-col">
        <url-box></url-box>
        <request-box :params="params" :method="method" :mode="mode"></request-box>
        <setting-field title="Result" v-if="mode === 'test'">
            <template scope="props">
                <result-box :fullscreen="props.fullscreen"></result-box>
            </template>
        </setting-field>
        <setting-field title="Response" v-if="response" >
            <template scope="props">
                <response :response="response" :fullscreen="props.fullscreen"></response>
            </template>
        </setting-field>
        <setting-field title="Api Desc" >
            <desc-box></desc-box>
        </setting-field>
    </div>
</template>

<script>
import RequestBox from './request/Index';
import ResultBox from './ResultBox';
import UrlBox from './UrlBox';
import Response from './response/Index';
import DescBox from './DescBox';
import SettingField from './SettingField';
export default {
    components: {
        RequestBox,
        Response,
        ResultBox,
        DescBox,
        UrlBox,
        SettingField
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
</style>
