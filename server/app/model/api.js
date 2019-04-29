module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types

  const ApiSchema = mongoose.Schema({
    // 接口文档主要内容
    name: {
      type: String,
      unique: false
    },
    desc: String,
    prodUrl: String,
    devUrl: String,
    options: {
      method: String,
      proxy: {
        type: Object,
        default: {
          mode: 0
        }
      },
      headers: {
        example: {},
        params: []
      },
      params: {},
      examples: {
        type: Object,
        default: {
          query: null,
          body: null,
          path: null
        }
      },
      response: {},
      responseIndex: {
        type: Number,
        default: 0
      },
      delay: Number
    },
    // 以下为管理文档所需信息
    group: {
      type: ObjectId,
      ref: 'group'
    },
    creator: { // 创建者
      type: ObjectId,
      required: true,
      ref: 'user'
    },
    manager: { // 管理员
      type: ObjectId,
      required: true,
      ref: 'user'
    },
    follower: [{ // 订阅者
      type: ObjectId,
      ref: 'user'
    }],
    createTime: {
      type: String,
      default: Date.now
    },
    modifiedTime: {
      type: String,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  })

  return mongoose.model('Api', ApiSchema)
}
