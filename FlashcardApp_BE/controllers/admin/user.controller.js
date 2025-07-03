// Model
const { userInfo } = require("os");
const User = require("../../models/user.model");
const UserInformation = require("../../models/userInformation.model");
const Session = require("../../models/session.model");
const PasswordResetToken = require("../../models/passwordResetToken.model");
const Role = require("../../models/role.model");

const YEAR_MILISECONDS = 365 * 24 * 60 * 60 * 60 * 1000;
//[GET] /api/v1/admin/users?limit=x&page=y&filter=createAt&order=asc
module.exports.getAllUserInfo = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
    const skip = (page - 1) * limit;
    const sortFields = [
        "createdAt",
        "updatedAt",
        "email",
        "fullName",
        "deleted",
        "status",
    ];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    try {
        const totalUser = await UserInformation.countDocuments();
        const totalPage = Math.ceil(totalUser / limit);
        const users = await UserInformation.find()
            .skip(skip)
            .limit(limit)
            .select("email fullName userId deleted status -_id")
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

//[POST] /api/v1/admin/users
module.exports.createAdmin = async (req, res) => {
    const {email, password, fullName, address, phone} = req.body;
}

//[GET] /api/v1/admin/users/:userId
module.exports.getUserInfo = async (req, res) => {
    const { userId } = req.params;
    try {
        const userInformationDoc = await UserInformation.findOne({
            userId: userId
        }).select("-_id -__v");
        const userRole = await User.findOne({ _id: userId }).populate("role", "title");
        if (!userInformationDoc) {
            return res.status(404).json({ message: "User not found" });
        }
        const userInformation = userInformationDoc.toObject();
        const currentDate = new Date(Date.now());
        const userCreateDate = new Date(userInformation.createdAt);
        userInformation.accountAge = Math.floor(
            Math.abs(currentDate - userCreateDate) / YEAR_MILISECONDS
        );
        userInformation.role = userRole.role.title;
        res.status(200).json({
            message: "Get user information successfully",
            data: userInformation,
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/users/${userId}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//[PATCH] /api/v1/admin/users/:userId
module.exports.changeUserInfo = async (req, res) => {
    const { userId } = req.params;
    const { email, fullName, address, status, phone, deleted = false, role = "User" } = req.body;
    try {
        const roleList = await Role.find({}).select("title").lean();
        let flag = -1;
        for(let i = 0; i < roleList.length; i++) {
            if(roleList[i].title === role) {
                flag = i;
                break;
            }
        }
        if(flag === -1) {
            return res.status(400).json({ message: "Role is not valid" });
        }
        const user = await User.findOne({ email: email });
        if (user && user._id.toString() !== userId) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const userInformationDoc = await UserInformation.findOne({
            userId: userId,
        });
        user.role = roleList[flag]._id.toString();
        user.deleted = (deleted === "true");
        userInformationDoc.deleted = (deleted === "true");
        if (phone !== undefined) {
            userInformationDoc.phone = phone;
        }
        if (address !== undefined) {
            userInformationDoc.address = address;
        }
        if (fullName !== undefined) {
            userInformationDoc.fullName = fullName;
        }
        if (status !== undefined) {
            userInformationDoc.status = status;
        }
        await userInformationDoc.save();
        await user.save();
        return res.status(200).json({
            message: "Update user information successfully",
            data: userInformationDoc,
        });
    } catch (error) {
        console.error(`[PATCH /api/v1/admin/users/${userId}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/admin/users/:userId
module.exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userInformation = await UserInformation.findOne({
            userId: userId,
        });
        user.deleted = true;
        userInformation.deleted = true;
        await user.save();
        await userInformation.save();
        await Session.deleteMany({userId: userId});
        await PasswordResetToken.deleteMany({userId: userId});
        return res.status(200).json({
            message: "Delete user successfully",
            data: {
                userId: userId,
                email: user.email,
                fullName: userInformation.fullName,
                address: userInformation.address,
                status: userInformation.status,
            },
        });
    } catch (error) {
        console.error(`[DELETE /api/v1/admin/users/:id] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

