<template>
    <div class="status">
        <div class="control">Status</div>
        <ul>
            <li class="item" v-for="(s, key) in status" :key="s">
                <span>200</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            status: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
        };
    }
};
</script>
<style>
</style>
