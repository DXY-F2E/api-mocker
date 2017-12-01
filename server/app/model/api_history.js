module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types
  const ApiHistorySchema = mongoose.Schema({
    apiId: {
      type: ObjectId,
      unique: true,
      ref: 'api'
    },
    records: [{
      operator: ObjectId,
      operatorName: String,
      createTime: {
        type: Date,
        default: Date.now
      },
      data: Object
    }],
    createTime: {
      type: Date,
      default: Date.now
    },
    updateTime: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('ApiHistory', ApiHistorySchema)
}
