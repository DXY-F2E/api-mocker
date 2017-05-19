module.exports = mongoose => {
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
            unique: true
        },
        teamId: [ObjectId],
        createTime: String,
        modifiedTime: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    });
    return mongoose.model('User', UserSchema);
}
