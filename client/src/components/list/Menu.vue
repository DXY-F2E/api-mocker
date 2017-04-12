<template>
    <el-col :span="0" class="menu-nav">
        <el-menu :default-active="$route.params.groupId" class="el-menu-vertical">
            <el-menu-item-group :class="{showSearch: isShowSearch}">
                <template slot="title">
                    <span @click="handleClickGroup">组列表</span>
                    <search @query="onQuery" placeholder="请输入分组名称" size="small"></search>
                    <i class="el-icon-plus title-icon" @click="handleClickShowDialog"></i>
                    <i class="el-icon-search title-icon" @click="showSearch()"></i>
                </template>
                <el-menu-item v-for="group in groups" :index="group._id" @click="handleClickGroup(group)" :key="group._id">
                    <i class="el-icon-minus"></i>{{group.name}}
                </el-menu-item>
            </el-menu-item-group>
        </el-menu>
        <create-group-dialog
            :visited="showCreateDialog"
            @action="handleClickCreateGroup"
            @close="handleClickClose"/>
    </el-col>
</template>
<script>
import createGroupDialog from '../../dialog/create-group';
import { mapState } from 'vuex';
import Search from './Search';
export default {
    components: {
        Search,
        createGroupDialog
    },
    data() {
        return {
            showCreateDialog: false,
            isShowSearch: false
        };
    },
    methods: {
        showSearch() {
            this.isShowSearch = true;
        },
        onQuery(val) {
            window.console.log(val);
        },
        handleClickGroup(group) {
            if (group && group._id) {
                // this.$store.dispatch('getGroupApi', { groupId: group._id }).then(() => {
                //     this.$router.replace(`/list/${group._id}`);
                // });
                this.$router.replace(`/list/${group._id}`);
            } else {
                // this.$store.dispatch('getApiList').then(() => {
                //     this.$router.replace('/');
                // });
                this.$router.replace('/');
            }
        },
        handleClickCreateGroup(groupName) {
            this.$store.dispatch('createGroup', { name: groupName}).then(() => {
                this.showCreateDialog = false;
            }).catch((e) => {
                window.console.log('error', e);
            });
        },
        handleClickClose() {
            this.showCreateDialog = false;
        },
        handleClickShowDialog() {
            this.showCreateDialog = true;
        }
    },
    computed: mapState(['groups'])
};
</script>
<style>
.menu-nav {
    width: 288px;
    min-width: 288px;
    background-color: #eef1f6;
}
.menu-nav .el-menu-item-group__title {
    padding: 15px 20px 0 20px;
    line-height: 30px;
    position: relative;
}
.el-menu-item-group > ul li i {
    visibility: hidden;
 }
.menu-nav .el-menu-item-group__title > i {
    position: relative;
    right: 0;
    margin: 0 3px;
    transform: rotate(0deg);
    transform-origin: 50% 50%;
    transition: transform .3s;
    cursor: pointer;
}
.menu-nav .el-menu-item-group__title .title-icon:hover {
    color: #20a0ff;
}
.menu-nav .el-icon-plus:hover {
    transform: rotate(90deg);
}
.menu-nav .el-icon-search.title-icon {
    top: 1px;
    font-size: 15px;
}
.menu-nav .search {
    display: none;
    position: absolute;
    width: auto;
    top: 15px;
    left: 91px;
    right: 20px;
    z-index: 1;
}
.menu-nav .showSearch .search {
    display: block;
}
.menu-nav .search .el-input__inner {
    background-color: #F9FAFC;
}
</style>
