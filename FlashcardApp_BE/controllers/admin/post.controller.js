//Models
const Post = require("../../models/post.model");


module.exports.getAllPosts = async (req, res) => {
    const posts = Post.find({
        deleted: false
    });
}