import R from 'ramda'
import { getDomain } from '../util'

const domain = getDomain()

export default R.map((url) => `${domain}${url}`)({
  GROUPS_ALL: '/server/group/all',
  GROUPS: '/server/group',
  GROUP: '/server/group/:groupId',
  APIS: '/server/api',
  GROUP_APIS: '/server/api/:groupId',
  GROUP_FOLLOWER: '/server/group/follower/:groupId',
  API: '/server/api/:groupId/:apiId',
  API_HISTORY: '/server/history/api/:apiId',
  API_AUTHORITY: '/server/authority/api/:apiId',
  API_FOLLOWER: '/server/api/follower/:apiId',
  USER: '/auth/user',
  USER_SEARCH: '/server/user/search',
  USER_FAVORITE: '/server/user/favorites/:groupId',
  PROFILE: '/server/user',
  STAT: '/server/stat'
})
