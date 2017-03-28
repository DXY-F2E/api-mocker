module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types
    const apiSchema = mongoose.Schema({
        group: {
            type: ObjectId,
            ref: 'group'
        },
        name: {
            type: String,
            unique: true
        },
        desc: String,
        createTime: String,
        modifiedTime: String,
        url: {
            type: String,
            unique: true
        },
        dsl: Object,
        options: {
            method: String,
            headers: {}
        }
    })

    return mongoose.model('api', apiSchema)
}
