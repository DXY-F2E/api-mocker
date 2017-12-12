/**
 * 团队；目前无用，可设计为分组的外层
 */
module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types
  const TeamSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    creator: {
      type: ObjectId,
      required: true
    },
    manager: {
      type: ObjectId,
      required: true
    },
    operator: [ ObjectId ],
    createTime: {
      type: Date,
      default: Date.now
    },
    modifiedTime: {
      type: Date,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  })
  return mongoose.model('Team', TeamSchema)
}
