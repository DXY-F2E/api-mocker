import Vue from 'vue';
import Router from 'vue-router';
import List from '@/components/list/Index';
import Edit from '@/components/edit/Index';
import ListContent from '@/components/list/Content';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/list'
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
        },
        {
            path: '/list',
            name: 'List',
            component: List,
            children: [{
                path: '',
                component: ListContent
            }, {
                path: ':groupId',
                component: ListContent
            }]
        }
    ]
});
