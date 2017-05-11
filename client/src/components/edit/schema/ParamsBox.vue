<template>
    <params :params="params"
            @updateParams="changeParams"></params>
</template>

<script>
import Params from './Params';
export default {
    components: {
        Params
    },
    props: ['params']
};
</script>
<style>
</style>
