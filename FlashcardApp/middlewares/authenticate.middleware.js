const jwt = require("jsonwebtoken");

module.exports.checkAccessToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: "Access denied: no Authorization header"});
    }
    const isBearer = authHeader.startsWith("Bearer ");
    if(!isBearer){
        return res.status(400).json({ message: "Authorization header must be bearer" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = await jwt.verify(token, process.env.ACCESS_SECRET);
        if (decodedToken && decodedToken.userId) {
            req.userId = decodedToken.userId;
            return next();
        } else {
            return res.status(403).json({ message: "Invalid token: userId missing" });
        }
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token"});
    }
}
