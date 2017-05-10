<template>
    <div class="apis el-col" v-if="groups" :class="$route.name">
        <el-menu :default-active="$route.params.apiId"
                 :default-openeds="defaultOpeneds"
                 class="el-menu-vertical"
                 :router="true">
            <el-submenu v-if="group" :index="group._id" class="group active-group">
                <template slot="title" >{{group.name}}</template>
                <el-menu-item v-for="api in apis"
                              :index="api._id"
                              :route="{ name: 'ApiDoc', params: { groupId: group._id, apiId: api._id}}"
                              :key="api._id"
                              class="api">
                    <label class="method" :class="api.options.method">{{api.options.method.toUpperCase()}}</label>
                    <span class="api-name">{{api.name}}</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item v-for="g in groups"
                          key="g._id"
                          v-if="g._id !== $route.params.groupId"
                          class="group"
                          :index="'/doc/'+g._id">{{g.name}}</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    props: ['apis'],
    computed: {
        defaultOpeneds() {
            return this.group ? [this.group._id] : [];
        },
        groups() {
            return this.$store.state.groups;
        },
        group() {
            return this.groups.find(g => g._id === this.$route.params.groupId);
        }
    },
    methods: {
        showApiDoc(api) {
            const { groupId, apiId } = this.$route.params;
            if (api._id === apiId) {
                return;
            }
            this.$router.push(`/doc/${groupId}/${api._id}`);
        }
    }
};
</script>
<style>
.apis.AllDoc {
    width: 100%;
    padding: 30px;
}
.apis.AllDoc .group {
    display: inline-block;
    margin: 20px;
}
.apis {
    transition: all 0.4s ease;
    width: 288px;
    min-width: 288px;
    background-color: #f8f8f8;
}
.apis .el-submenu .el-menu {
    background-color: #f8f8f8;
}
.apis .el-menu {
    background-color: #f8f8f8;
}
.apis .el-submenu .api {
    height: 36px;
    line-height: 36px;
    padding: 0 30px !important;
}
.apis .el-submenu.active-group .el-submenu__title{
    /*border-bottom: 1px solid #d1dbe5;*/
    /*background-color: #D3DCE6;*/
}
.apis .el-submenu .el-menu-item.api:hover {
    background-color: #eee;
}
.apis .el-menu-item-group__title {
    margin-bottom: 20px;
}
.apis .method {
    display: inline-block;
    width: 44px;
    text-align: right;
    margin-right: 8px;
    font-size: 12px;
}
.apis .api-name {
    vertical-align: middle;
    display: inline-block;
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
