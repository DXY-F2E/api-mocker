module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types
  const ApiSchema = mongoose.Schema({
    group: {
      type: ObjectId,
      ref: 'group'
    },
    name: {
      type: String,
      unique: false
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
    desc: String,
    createTime: {
      type: String,
      default: Date.now
    },
    modifiedTime: {
      type: String,
      default: Date.now
    },
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
    isDeleted: {
      type: Boolean,
      default: false
    }
  })

  return mongoose.model('Api', ApiSchema)
}
