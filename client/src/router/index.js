import Vue from 'vue';
import Router from 'vue-router';
// import List from '@/components/list/Index';
// import ListContent from '@/components/list/Content';
// import Edit from '@/components/edit/Index';
// import Document from '@/components/document/Index';
// import DocOverview from '@/components/document/Overview';
// import GroupContent from '@/components/document/GroupContent';
// import ApiContent from '@/components/document/ApiContent';
// import Auth from '@/components/auth/Index';
// import Login from '@/components/auth/Login';
// import Register from '@/components/auth/Register';

const List = r => require.ensure([], () => r(require('@/components/list/Index')), 'list');
const ListContent = r => require.ensure([], () => r(require('@/components/list/Content')), 'list');

const Edit = r => require.ensure([], () => r(require('@/components/edit/Index')), 'edit');

const Document = r => require.ensure([], () => r(require('@/components/document/Index')), 'document');
const GroupContent = r => require.ensure([], () => r(require('@/components/document/GroupContent')), 'document');
const DocOverview = r => require.ensure([], () => r(require('@/components/document/Overview')), 'document');
const ApiContent = r => require.ensure([], () => r(require('@/components/document/ApiContent')), 'document');

const Auth = r => require.ensure([], () => r(require('@/components/auth/Index')), 'auth');
const Login = r => require.ensure([], () => r(require('@/components/auth/Login')), 'auth');
const Register = r => require.ensure([], () => r(require('@/components/auth/Register')), 'auth');

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
            path: '/auth',
            name: 'Auth',
            component: Auth,
            meta: {
                noAuth: true
            },
            children: [{
                path: 'auth-login',
                alias: '/login',
                name: 'Login',
                component: Login
            }, {
                path: 'auth-register',
                alias: '/register',
                name: 'Register',
                component: Register
            }]
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
