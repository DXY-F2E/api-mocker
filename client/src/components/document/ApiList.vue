<template>
    <div class="apis el-col">
        <el-menu :default-active="$route.params.apiId" class="el-menu-vertical" v-if="group">
            <el-menu-item-group :title="group.name">
                <el-menu-item v-for="api in apis"
                              :index="api._id"
                              :key="api._id"
                              @click="showApiDoc(api)"
                              class="api">
                    <label class="method" :class="api.options.method">{{api.options.method.toUpperCase()}}</label>{{api.name}}
                </el-menu-item>
            </el-menu-item-group>
        </el-menu>
    </div>
</template>

<script>
export default {
    props: ['apis', 'groups'],
    methods: {
        showApiDoc(api) {
            const { groupId, apiId } = this.$route.params;
            if (api._id === apiId) {
                return;
            }
            this.$router.push(`/doc/${groupId}/${api._id}`);
            this.$emit('change');
        }
    },
    data() {
        return {
            group: this.groups.find(g => g._id === this.$route.params.groupId)
        };
    }
};
</script>
<style scoped>
.apis {
    padding: 10px 0;
    width: 288px;
    min-width: 288px;
    background-color: #f8f8f8;
}
.apis .el-menu {
    background-color: #f8f8f8;
}
.apis .api {
    height: 36px;
    line-height: 36px;
}
.apis .el-menu-item-group__title {
    margin-bottom: 20px;
}
.apis .method {
    display: inline-block;
    width: 42px;
    text-align: right;
    margin-right: 10px;
    font-size: 12px;
}
</style>
