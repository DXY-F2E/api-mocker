<template>
  <div class="main">
    <div class="api-box">
        <url-box></url-box>
        <request-box></request-box>
        <response-box></response-box>
    </div>
  </div>
</template>

<script>
import RequestBox from './RequestBox';
import ResponseBox from './ResponseBox';
import UrlBox from './UrlBox';
export default {
    components: {
        RequestBox,
        ResponseBox,
        UrlBox
    }
};
</script>
<style>
.api-box {
    margin: 20px;
}
</style>
