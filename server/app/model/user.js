module.exports = app => {
  const mongoose = app.mongoose
  const { ObjectId } = mongoose.Schema.Types
  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    teamId: [ ObjectId ],
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
  return mongoose.model('User', UserSchema)
}
