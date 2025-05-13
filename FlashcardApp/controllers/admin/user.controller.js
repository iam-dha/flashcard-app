// Model
const User = require("../../models/user.model");
const UserInformation = require("../../models/userInformation.model");

//[GET] /api/v1/admin/users?limit=x&page=y&filter=createAt&order=asc
module.exports.getAllUserInfo = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
    const skip = (page - 1) * limit;
    const sortFields = ["createdAt", "updatedAt", "email", "fullName", "deleted", "status"];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;    
    try {
        const totalUser = await UserInformation.countDocuments();
        const totalPage = Math.ceil(totalUser / limit);
        const users = await UserInformation.find()
            .skip(skip)
            .limit(limit)
            .select("email fullName userId deleted status")
            .sort({ [sortFilter]: sortOrder });
        return res.status(200).json({
            message: "Get all user information successfully",
            data: {
                totalCount: totalUser,
                currentPage: page,
                totalPage: totalPage,
                users: users,
            },
        });
    } catch (error) {
        console.error(`[POST /api/v1/admin/users] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//[GET] /api/v1/admin/users/:id
module.exports.getUserInfo = async (req, res) => {
    const { id } = req.params;
    
}
