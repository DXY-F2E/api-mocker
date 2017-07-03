module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types
    const ApiAuthoritySchema = mongoose.Schema({
        apiId: {
            type: ObjectId,
            unique: true,
            ref: 'api'
        },
        operation: {
            mode: {
                type: Number,
                default: 0  // 0 - 所有人, 1 - 指定
            },
            operator: {
                type: Array,
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