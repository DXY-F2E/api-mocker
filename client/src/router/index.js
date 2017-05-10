import Vue from 'vue';
import Router from 'vue-router';
import List from '@/components/list/Index';
import Edit from '@/components/edit/Index';
import ListContent from '@/components/list/Content';
import Document from '@/components/document/Index';
import DocOverview from '@/components/document/Overview';
import GroupContent from '@/components/document/GroupContent';
import ApiContent from '@/components/document/ApiContent';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/list/all'
        },
        {
            path: '/list',
            redirect: '/list/all'
        },
        {
            path: '/create',
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
            component: List,
            name: 'List',
            children: [{
                path: 'all',
                name: 'AllList',
                component: ListContent
            }, {
                path: ':groupId',
                name: 'GruopList',
                component: ListContent
            }]
        },
        {
            path: '/doc',
            component: Document,
            name: 'Document',
            redirect: '/doc/all',
            children: [{
                path: 'all',
                name: 'AllDoc',
                component: DocOverview
            }, {
                path: ':groupId',
                name: 'GroupDoc',
                component: GroupContent
            }, {
                path: ':groupId/:apiId',
                name: 'ApiDoc',
                component: ApiContent
            }]
        }
    ]
});
