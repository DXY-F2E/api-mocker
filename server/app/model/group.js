module.exports = mongoose => {
    const GroupSchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true
        },
        createTime: String,
        modifiedTime: String,
        desc: String
    });
    return mongoose.model('Group', GroupSchema);
}
