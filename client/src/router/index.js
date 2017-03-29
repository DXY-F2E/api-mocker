import Vue from 'vue';
import Router from 'vue-router';
import List from '@/components/list/Index';
import Edit from '@/components/edit/Index';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'List',
            component: List
        },
        {
            path: '/edit',
            name: 'Create',
            component: Edit
        },
        {
            path: '/edit/:groupId/:apiId',
            name: 'Edit',
            component: Edit
        }
    ]
});
