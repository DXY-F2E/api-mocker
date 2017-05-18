module.exports = mongoose => {
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
        operator: [ObjectId],
        createTime: String,
        modifiedTime: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    });
    return mongoose.model('Team', TeamSchema);
}
