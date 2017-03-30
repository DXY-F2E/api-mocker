<template>
    <div class="api-box el-col">
        <url-box></url-box>
        <request-box></request-box>
        <response-box></response-box>
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
    },
    computed: {
        api() {
            return this.$store.state.api;
        }
    }
};
</script>
<style>
.api-box {
    padding: 20px;
}
</style>
