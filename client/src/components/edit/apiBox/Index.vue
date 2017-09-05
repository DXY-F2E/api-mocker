<template>
  <div class="api-box el-col">
    <url-box></url-box>
    <setting-field title="Request" class="request-field">
      <template scope="props">
        <request-box :fullscreen="props.fullscreen" :method="method"></request-box>
      </template>
    </setting-field>
    <setting-field title="Result" v-if="mode === 'test'">
      <el-tabs v-model="resActive" slot="header" class="result-tabs">
        <el-tab-pane label="Body" name="body"></el-tab-pane>
        <el-tab-pane label="Headers" name="header"></el-tab-pane>
        <el-tab-pane label="All-Data" name="all"></el-tab-pane>
      </el-tabs>
      <template scope="props">
        <result-box :fullscreen="props.fullscreen" :res-active="resActive"></result-box>
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
import RequestBox from './request/Index'
import Response from './response/Index'
import ResponseConfig from './response/Config'
import ResultBox from './ResultBox'
import UrlBox from './UrlBox'
import DescBox from './DescBox'
import SettingField from './SettingField'
export default {
  components: {
    RequestBox,
    Response,
    ResponseConfig,
    ResultBox,
    DescBox,
    UrlBox,
    SettingField
  },
  data () {
    return {
      resActive: 'body'
    }
  },
  computed: {
    mode () {
      return this.$store.state.mode
    },
    method () {
      return this.$store.state.api.options.method
    },
    response () {
      return this.$store.state.api.options.response
    }
  }
}
</script>
<style>
.api-box {
  padding: 20px;
  min-width: 688px;
}
.result-tabs.el-tabs {
  display: inline-block;
  margin: 0 0 -1px 30px;
  vertical-align: top;
}
.result-tabs .el-tabs__header {
  margin-bottom: 0;
}
</style>
