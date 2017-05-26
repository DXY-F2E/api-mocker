module.exports = mongoose => {
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
        createTime: {
            type: Date,
            default: Date.now
        }
    })

    return mongoose.model('ApiStat', ApiStatSchema)
}