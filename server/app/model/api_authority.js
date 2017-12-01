module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types
  const ApiAuthoritySchema = mongoose.Schema({
    apiId: {
      type: ObjectId,
      unique: true,
      ref: 'api'
    },
    operation: { // 编辑权限
      mode: {
        type: Number,
        default: 0 // 0 - 所有人, 1 - 组内人员 2 - 指定人员
      },
      operator: {
        type: [ ObjectId ],
        default: []
      }
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    modifiedTime: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('ApiAuthority', ApiAuthoritySchema)
}
