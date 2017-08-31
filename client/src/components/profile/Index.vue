<template>
<div class="profile-box">
    <el-form label-width="80px" label-position="left">
        <user-item v-for="item in userItems"
                   :key="item.key"
                   :item="item">
        </user-item>
        <el-form-item label="团队">丁香园</el-form-item>
        <input type="text" class="hidden" name="为了阻止单个input回车触发submit">
    </el-form>
</div>
</template>

<script>
import UserItem from './UserItem'
export default {
    components: {
        UserItem
    },
    computed: {
        userItems () {
            return [{
                label: '姓名',
                key: 'name'
            }, {
                label: '邮箱',
                key: 'email'
            }]
        }
    }
}
</script>
<style lang="less">
.profile-box {
    padding: 20px;

    .hidden {
        display: none;
    }
}
</style>
