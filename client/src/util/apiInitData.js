import Schema from '@/model/schema'
function initData () {
  return {
    prodUrl: null,
    devUrl: null,
    name: '',
    group: '',
    desc: null,
    creator: null,
    manager: null,
    follower: [],
    options: {
      proxy: {
        mode: 0
      },
      response: [new Schema()],
      responseIndex: 0,
      headers: {
        example: null,
        params: []
      },
      method: 'get',
      delay: 0,
      examples: {
        query: null,
        body: null,
        path: null
      },
      params: {
        query: [],
        body: [],
        path: []
      }
    }
  }
}
export default initData
