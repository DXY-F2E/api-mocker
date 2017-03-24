module.exports = mongoose => {
    const GroupSchema = new mongoose.Schema({
        name: String,
        createTime: String,
        modifiedTime: String,
        desc: String
    });
    return mongoose.model('Group', GroupSchema);
}
