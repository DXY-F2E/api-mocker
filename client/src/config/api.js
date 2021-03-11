import R from 'ramda'
import { getDomain } from '../util'

const domain = getDomain()

export default R.map((url) => `${domain}${url}`)({
  MOVE_APIS: '/server/api/moveApis',
  GROUPS_ALL: '/server/group/all',
  GROUPS: '/server/group',
  GROUP: '/server/group/:groupId',
  QUERY_GROUP: '/server/group/query/:groupId',
  APIS: '/server/api',
  GROUP_APIS: '/server/api/:groupId',
  GROUP_APIS_COPY: '/server/api/copy/:groupId',
  GROUP_EXPORT: '/server/group/export/:groupId',
  GROUP_FOLLOWER: '/server/group/follower/:groupId',
  GROUP_IMPORT_APIS: '/server/group/import/:groupId',
  API: '/server/api/:groupId/:apiId',
  API_EXPORT: '/server/api/export',
  API_HISTORY: '/server/history/api/:apiId',
  API_AUTHORITY: '/server/authority/api/:apiId',
  API_FOLLOWER: '/server/api/follower/:apiId',
  API_STATUS: '/server/api/status/:apiId',
  USER: '/auth/user',
  USER_SEARCH: '/server/user/search',
  USER_FAVORITE: '/server/user/favorites/:groupId',
  PROFILE: '/server/user',
  STAT: '/server/stat',
  LOCAL_DEBUG: '/server/localDebug'
})
