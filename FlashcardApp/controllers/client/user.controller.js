const UserInformation = require("../../models/userInformation.model");
const YEAR_MILISECONDS = 365 * 24 * 60 * 60 * 60 * 1000;
// [GET] /api/v1/user/settings
module.exports.setting = async (req, res) => {
    const userId = req.userId;

    try {
        const userInformationDoc = await UserInformation.findOne({
            userId: userId,
            deleted: false,
            status: "active"
        }).select("-deleted -__v -_id -_userId -updatedAt");
        if(!userInformationDoc){
            return res.status(404).json({message: "User information not found or inactive"});
        }
        const userInformation = userInformationDoc.toObject();
        const userCreateDate = new Date(userInformation.createdAt);
        const current = new Date(Date.now());
        delete userInformation.createdAt;
        userInformation.accountAge = Math.floor(Math.abs(current - userCreateDate) / YEAR_MILISECONDS);
        res.status(200).json(userInformation);
    } catch (error) {
        console.error(`[GET /user/settings] Error:`, error);
        return res.status(500).json({message: "Internal server error"});
    }

}