import R from 'ramda'
import { getDomain } from '../util'

const domain = getDomain()

export default R.map((url) => `${domain}${url}`)({
  GROUPS: '/server/group',
  GROUP: '/server/group/:groupId',
  APIS: '/server/api',
  GROUP_APIS: '/server/api/:groupId',
  API: '/server/api/:groupId/:apiId',
  API_HISTORY: '/server/history/api/:apiId',
  API_AUTHORITY: '/server/authority/api/:apiId',
  API_FOLLOWER: '/server/api/follower/:apiId',
  USER: '/auth/user',
  PROFILE: '/server/user',
  STAT: '/server/stat'
})
