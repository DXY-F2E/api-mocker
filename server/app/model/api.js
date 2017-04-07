module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types
    const apiSchema = mongoose.Schema({
        group: {
            type: ObjectId,
            ref: 'group'
        },
        name: {
            type: String,
            unique: false
        },
        desc: String,
        createTime: {
            type: String,
            default: Date.now
        },
        modifiedTime: {
            type: String,
            default: Date.now
        },
        url: {
            type: String,
            unique: true
        },
        dsl: Object,
        options: {
            method: String,
            headers: {},
            params: {},
            delay: Number
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    })

    return mongoose.model('api', apiSchema)
}
