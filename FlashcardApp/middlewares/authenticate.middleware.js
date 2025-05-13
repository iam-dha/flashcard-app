const jwt = require("jsonwebtoken");
const Role = require("../models/role.model");
module.exports.checkAccessToken = (role = "User") => {
    return async (req, res, next) => {
        console.log("checking access token");
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: "Access denied: no Authorization header" });
        }
        const isBearer = authHeader.startsWith("Bearer ");
        if (!isBearer) {
            return res
                .status(400)
                .json({ message: "Authorization header must be bearer" });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decodedToken = await jwt.verify(token, process.env.ACCESS_SECRET);
            if (decodedToken && decodedToken.userId) {
                req.userId = decodedToken.userId;
                req.email = decodedToken.email;
                if(role !== "User") {
                    req.role = decodedToken.role;
                    if (decodedToken.role !== role) {
                        return res.status(403).json({
                            message: `Access denied: ${role} required`,
                        });
                    }
                }
                return next();
            } else {
                return res
                    .status(403)
                    .json({ message: "Invalid token: userId missing" });
            }
        } catch (error) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    };
}

module.exports.checkPermission = (requiredPermissions = []) => {
    return async (req, res, next) => {
        const roleTitle = req.role;
        if(!roleTitle) {
            return res.status(403).json({ message: "Access denied: no role found" });
        }
        const role = await Role.findOne({title: roleTitle});
        if (!role) {
            return res.status(403).json({ message: "Access denied: role not found" });
        }
        const permissions = role.permissions || [];

        const hasPermission = requiredPermissions.some(permission => permissions.includes(permission))
        if (!hasPermission) {
            return res.status(403).json({ message: "Access denied: insufficient permission" });
        }
        return next();
    };
}
    

