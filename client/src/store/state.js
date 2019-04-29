import { getDomain } from '@/util'

const domain = getDomain()
/**
 * 全局的状态维护
 */
const state = {
  user: null,
  // 搜索结果
  search: {
    keyword: '',
    groupList: {
      resources: []
    },
    apiList: {
      resources: []
    }
  },
  groups: [],
  apiList: [],
  apiListLoading: false,
  apiListSuccess: true,
  serverRoot: domain,
  windowWidth: 0,
  allUsers: []
}

export default state
