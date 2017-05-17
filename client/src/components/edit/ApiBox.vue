<template>
    <div class="api-box el-col">
        <url-box></url-box>
        <setting-field title="Request" class="request-field">
            <template scope="props">
                <request-box :fullscreen="props.fullscreen"></request-box>
            </template>
        </setting-field>
        <setting-field title="Result" v-if="mode === 'test'">
            <template scope="props">
                <result-box :fullscreen="props.fullscreen"></result-box>
            </template>
        </setting-field>
        <setting-field title="Response" v-if="response" >
            <response-config slot="header"></response-config>
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
import ResponseConfig from './response/Config';
export default {
    components: {
        RequestBox,
        Response,
        ResultBox,
        DescBox,
        UrlBox,
        ResponseConfig,
        SettingField
    },
    computed: {
        mode() {
            return this.$store.state.mode;
        },
        response() {
            return this.$store.state.api.options.response;
        }
    }
};
</script>
<style>
.api-box {
    padding: 20px;
}
.request-field {
    margin-top: 20px;
}
</style>
