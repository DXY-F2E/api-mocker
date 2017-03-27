module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types
    const apiSchema = mongoose.Schema({
        group: {
            type: ObjectId,
            ref: 'group'
        },
        name: String,
        desc: String,
        createTime: String,
        modifiedTime: String,
        url: String,
        dsl: Object,
        options: {
            method: String,
            headers: {}
        }
    })

    return mongoose.model('api', apiSchema)
}
