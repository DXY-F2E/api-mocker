import { getDomain, apiInitData } from '@/util'

const domain = getDomain()

const state = {
  user: null,
  groups: [],
  apiList: [],
  apiListLoading: false,
  apiListSuccess: true,
  api: apiInitData(),
  apiUnsaved: false,
  mode: 'edit',
  reqParams: {
    query: {
      value: {},
      params: []
    },
    body: {
      value: {},
      params: []
    },
    path: {
      value: {},
      params: []
    }
  },
  response: {},
  serverRoot: domain,
  dslStatus: {
    success: true,
    msg: ''
  },
  windowWidth: 0,
  allUsers: []
}

export default state
