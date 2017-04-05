<template>
    <div class="api-box el-col">
        <url-box></url-box>
        <div class="animate">
            <request-box></request-box>
            <response-box></response-box>
        </div>
        <desc-box></desc-box>
    </div>
</template>

<script>
import RequestBox from './RequestBox';
import ResponseBox from './ResponseBox';
import UrlBox from './UrlBox';
import DescBox from './DescBox';
export default {
    components: {
        RequestBox,
        ResponseBox,
        DescBox,
        UrlBox
    }
};
</script>
<style>
.api-box {
    padding: 20px;
}
.animate {
    background-color: #fff;
    margin-top: 20px;
    /*-webkit-transform: rotate3d(0, 1, 0, -360deg);*/
    /*transform: rotate3d(0, 1, 0, -360deg);*/
    /*transition: all 0.3s ease-out;*/
}
.edit .animate {
    /*-webkit-transform: rotate3d(0, 1, 0, 0deg);*/
    /*transform: rotate3d(0, 1, 0, 0deg);*/
}
</style>
