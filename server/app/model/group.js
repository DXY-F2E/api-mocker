module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types
    const GroupSchema = new mongoose.Schema({
        teamId: {
            type: ObjectId,
            required: true
        },
        creator: {
            type: ObjectId,
            required: true
        },
        manager: {
            type: ObjectId,
            required: true
        },
        member: [ObjectId],
        public: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        level: {
            type: Number,
            required: true,
            default: 1
        },
        createTime: String,
        modifiedTime: String,
        desc: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    });
    return mongoose.model('Group', GroupSchema);
}
