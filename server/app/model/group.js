module.exports = mongoose => {
    const { ObjectId } = mongoose.Schema.Types
    const GroupSchema = new mongoose.Schema({
        teamId: {
            type: ObjectId,
            required: false
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
        operation: {
            type: Number,
            default: 0 // 0 - 所有人可操作，1 - 组内成员可操作
        },
        privacy: {
            type: Number,
            default: 0 // 0 - 所有人可见， 1 - 组内成员可见, 3 - 仅自己可以
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
        createTime: {
            type: String,
            default: Date.now
        },
        modifiedTime: {
            type: String,
            default: Date.now
        },
        desc: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    });
    return mongoose.model('Group', GroupSchema);
}
