import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/Admin'
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

const Manage = r => require.ensure([], () => r(require('@/components/manage/Index')), 'manage')
const Profile = r => require.ensure([], () => r(require('@/components/profile/Index')), 'manage')
const ManageGroup = r => require.ensure([], () => r(require('@/components/manage/Group')), 'manage')
const ManageApi = r => require.ensure([], () => r(require('@/components/manage/Api')), 'manage')

const List = r => require.ensure([], () => r(require('@/components/list/Index')), 'list')
// const ListContent = r => require.ensure([], () => r(require('@/components/list/Content')), 'list');

const Edit = r => require.ensure([], () => r(require('@/components/edit/Index')), 'edit')

const Document = r => require.ensure([], () => r(require('@/components/document/Index')), 'document')
const GroupContent = r => require.ensure([], () => r(require('@/components/document/GroupContent')), 'document')
const DocOverview = r => require.ensure([], () => r(require('@/components/document/Overview')), 'document')
const ApiContent = r => require.ensure([], () => r(require('@/components/document/ApiContent')), 'document')

const Auth = r => require.ensure([], () => r(require('@/components/auth/Index')), 'auth')
const Login = r => require.ensure([], () => r(require('@/components/auth/Login')), 'auth')
const Register = r => require.ensure([], () => r(require('@/components/auth/Register')), 'auth')
const FindPass = r => require.ensure([], () => r(require('@/components/auth/FindPass')), 'auth')
const ResetPass = r => require.ensure([], () => r(require('@/components/auth/ResetPass')), 'auth')

const Stat = r => require.ensure([], () => r(require('@/components/stat/Index')), 'stat')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Admin',
      redirect: '/list/all',
      component: Admin,
      meta: {
        auth: true
      },
      children: [
        {
          path: 'stat',
          name: 'Stat',
          component: Stat
        },
        {
          path: 'manage',
          name: 'Manage',
          component: Manage,
          children: [{
            path: 'profile',
            name: 'Profile',
            component: Profile
          }, {
            path: 'group',
            name: 'ManageGroup',
            component: ManageGroup
          }, {
            path: 'api',
            name: 'ManageApi',
            component: ManageApi
          }]
        },
        {
          path: 'create',
          name: 'Create',
          component: Edit
        },
        {
          path: '/edit/:groupId/:apiId',
          name: 'Edit',
          component: Edit
        },
        {
          path: 'list',
          component: List,
          redirect: '/list/all',
          name: 'List',
          children: [{
            path: 'all',
            name: 'AllList'
                        // component: ListContent
          }, {
            path: ':groupId',
            name: 'GruopList'
                        // component: ListContent
          }]
        },
        {
          path: 'doc',
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
    },
    {
      path: '/',
      name: 'Auth',
      component: Auth,
      meta: {
        auth: true
      },
      children: [{
        path: 'login',
        name: 'Login',
        component: Login
      }, {
        path: 'register',
        name: 'Register',
        component: Register
      }, {
        path: 'reset-pass',
        name: 'ResetPass',
        component: ResetPass
      }, {
        path: 'find-pass',
        name: 'FindPass',
        component: FindPass
      }]
    }
  ]
})
export default router
