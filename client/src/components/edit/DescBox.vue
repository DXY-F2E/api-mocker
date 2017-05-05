<template>
    <div class="desc-box">
        <div class="hd">API Description</div>
        <simditor id="desc-editor" placeholder="接口描述" v-model="desc" @change="updateDesc"></simditor>
    </div>
</template>

<script>
import Simditor from '../common/Simditor';

export default {
    components: {
        Simditor
    },
    methods: {
        updateDesc(val) {
            this.$store.commit('UPDATE_API_PROPS', ['desc', val]);
        }
    },
    computed: {
        desc() {
            return this.$store.state.api.desc;
        }
    }
};
</script>
<style>
.desc-box .simditor {
    border: none;
}
#desc-editor {
    min-height: 200px;
}
</style>
