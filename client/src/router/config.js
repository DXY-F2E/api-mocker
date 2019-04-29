import Admin from '@/components/Admin'
// 管理中心
const Manage = r => require.ensure([], () => r(require('@/views/manage/Index')), 'manage')
const Profile = r => require.ensure([], () => r(require('@/views/manage/profile/Index')), 'manage')
const ManageGroup = r => require.ensure([], () => r(require('@/views/manage/group/Index')), 'manage')
const ManageApi = r => require.ensure([], () => r(require('@/views/manage/api/Index')), 'manage')

const List = r => require.ensure([], () => r(require('@/views/list/Index')), 'list')
const GlobalSearch = r => require.ensure([], () => r(require('@/views/list/Search')), 'list')
const GroupList = r => require.ensure([], () => r(require('@/views/list/Content')), 'list')

// API 文档 编辑
const Edit = r => require.ensure([], () => r(require('@/views/edit/Index')), 'edit')
// API 文档 展示
const Document = r => require.ensure([], () => r(require('@/views/document/Index')), 'document')
const GroupContent = r => require.ensure([], () => r(require('@/views/document/GroupContent')), 'document')
const DocOverview = r => require.ensure([], () => r(require('@/views/document/Overview')), 'document')
const ApiContent = r => require.ensure([], () => r(require('@/views/document/ApiContent')), 'document')
// 由于 diff 页面与 文档页依赖基本一致，故放到同一chunk
const Diff = r => require.ensure([], () => r(require('@/views/diff/Index')), 'document')

const Auth = r => require.ensure([], () => r(require('@/views/auth/Index')), 'auth')
const Login = r => require.ensure([], () => r(require('@/views/auth/Login')), 'auth')
const DxyLogin = r => require.ensure([], () => r(require('@/views/auth/DxyLogin')), 'auth')
const Register = r => require.ensure([], () => r(require('@/views/auth/Register')), 'auth')
const FindPass = r => require.ensure([], () => r(require('@/views/auth/FindPass')), 'auth')
const ResetPass = r => require.ensure([], () => r(require('@/views/auth/ResetPass')), 'auth')

const Stat = r => require.ensure([], () => r(require('@/components/stat/Index')), 'stat')

export default [
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
        redirect: '/list/search',
        name: 'List',
        children: [
          // 老的页面，跳转到新的统一搜索页
          {
            path: 'all',
            redirect: '/list/search'
          },
          {
            path: 'search',
            name: 'GlobalSearch',
            component: GlobalSearch
          },
          {
            path: ':groupId',
            name: 'GruopList',
            component: GroupList
          }
        ]
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
      },
      {
        path: 'diff/:groupId/:apiId',
        component: Diff,
        name: 'Diff'
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
      path: 'dxy-login',
      name: 'DxyLogin',
      component: DxyLogin
    }, {
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
