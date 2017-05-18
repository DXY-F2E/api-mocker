module.exports = mongoose => {
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
        createTime: String,
        modifiedTime: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    });
    return mongoose.model('User', UserSchema);
}
