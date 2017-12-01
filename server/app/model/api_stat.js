const moment = require('moment')
module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types
  const ApiStatSchema = mongoose.Schema({
    apiId: {
      type: ObjectId,
      ref: 'api'
    },
    behavior: {
      type: Number,
      required: true
    },
    result: {
      status: Boolean,
      msg: String
    },
    user: ObjectId,
    createDay: {
      type: String,
      default: () => moment().format('YYYY-MM-DD')
    },
    createTime: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('ApiStat', ApiStatSchema)
}
