//Models
const Post = require("../../models/post.model");

// [GET] /api/v1/posts?limit=x&page=y&filter=createAt&order=asc
module.exports.getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
    const sortFields = ["createdAt"];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    try {
        const posts = await Post.find({ deleted: false })
            .limit(limit)
            .select("-__v")
            .skip(skip)
            .sort({ [sortFilter]: sortOrder });

        const postsCount = await Post.countDocuments({ deleted: false });

        return res.status(200).json({
            message: "Get posts successfully",
            data: {
                totalCount: postsCount,
                currentPage: page,
                totalPages: Math.ceil(postsCount / limit),
                posts: posts,
            },
        });
    } catch (error) {
        console.error(`[GET /api/v1/posts] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

// [GET] /api/v1/posts/:slug
module.exports.getDetailPost = async (req, res) => {
    const {slug} = req.params;

    try {
        const post = await Post.findOne({
            slug: slug,
            deleted: false,
        }).select("-__v");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({
            message: "Get post successfully",
            data: post,
        });
    } catch (error) {
        console.error(`[GET /api/v1/posts/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

