<template>
    <el-col :span="0" class="menu-nav">
        <el-menu default-active="group" class="el-menu-vertical">
            <el-menu-item-group>
                <template slot="title">
                    组列表
                    <i class="el-icon-plus title-icon" @click="handleClickShowDialog"></i>
                </template>
                <el-menu-item v-for="group in groups" :key="group._id" :index="group._id" >
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
 
 export default {
     components: {
         'create-group-dialog': createGroupDialog
     },
     data() {
         return {
             showCreateDialog: false
         };
     },
     methods: {
         handleClickCreateGroup(groupName) {
             this.$store.dispatch('createGroup', { name: groupName}).then(() => {
                 this.showCreateDialog = false;
             }).catch((e) => {
                 console.log('error', e);
             });
         },
         handleClickClose() {
             this.showCreateDialog = false;
         },
         handleClickShowDialog() {
             this.showCreateDialog = true;
         }
     },
     computed: {
         groups() {
             return this.$store.state.groups;
         }
     }
 };
</script>
<style>
.menu-nav {
    width: 288px;
    min-width: 288px;
    background-color: #eef1f6;
}
.el-menu-item-group > ul li i {
    visibility: hidden;
 }
 .title-icon {
     position: relative;
     right: 0;
     margin: 2px;
     transform: rotate(0deg);
     transform-origin: 50% 50%;
     transition: transform .3s;
 }
 .title-icon:hover {
     transform: rotate(90deg);
 }
</style>
