module.exports = mongoose => {
    const GroupSchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true
        },
        level: {
            type: Number,
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
