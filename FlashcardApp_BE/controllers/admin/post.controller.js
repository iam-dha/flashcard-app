//Models
const Post = require("../../models/post.model");

// [GET] /api/v1/admin/posts?limit=x&page=y&filter=createAt&order=asc
module.exports.getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc"} = req.query;
    const sortFields = [
        "createdAt",
        "updatedAt",
        "deleted"
    ];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    try {
        const posts = await Post.find({
            deleted: false,
        }).limit(limit).skip(skip).sort({ [sortFilter]: sortOrder });
        const postsCount = await Post.countDocuments({
            deleted: false,
        });
        return res.status(200).json({
            results: postsCount,
            data: posts,
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/posts] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/posts/:post_id
module.exports.getPost = async (req, res) => {
    const { post_id } = req.params;
    try {
        
    } catch (error) {
        console.error(`[GET /api/v1/admin/posts/${post_id}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
