const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const systemConfig = require("../../config/system");
const redisClient = require("../../config/redis");
const mailer = require("../../services/mailer.service");
// Models
const User = require("../../models/user.model");
const Session = require("../../models/session.model");
const Role = require("../../models/role.model");
const UserInformation = require("../../models/userInformation.model");
// Helpers
const tokenGenerate = require("../../helpers/tokenGenerate.helper");
const cookieHelper = require("../../helpers/refreshTokenCookie.helper");

//[POST] /api/v1/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    let find = {
        deleted: false,
        email: email,
    };
    try {
        const user = await User.findOne(find).populate("role");
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res
                .status(401)
                .json({ message: "Invalid password" });

        const accessToken = tokenGenerate.generateAccessToken(user);
        const refreshToken = tokenGenerate.generateRefreshToken(user);

        let sessions = await Session.find({
            userId: user._id,
            isRevoked: false,
        }).sort({ createdAt: 1 });
        if (sessions.length >= systemConfig.maxSessions) {
            const oldestSession = sessions[0];
            (oldestSession.isRevoked = true), await oldestSession.save();
        }
        const sessionDate = new Date(
            Date.now() +
                systemConfig.refreshTokenExpiration.inNumber *
                    24 *
                    60 *
                    60 *
                    1000
        );
        let session = new Session({
            userId: user._id,
            refreshToken,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: sessionDate,
        });

        await session.save();

        cookieHelper.setRefreshTokenCookie(res, refreshToken);
        console.log(`${new Date(Date.now())} --- ${email} logged in `);
        res.json({ accessToken: accessToken, role: user.role.title });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//[POST] api/v1/auth/register/request-otp
module.exports.registerOTP = async (req, res) => {
    const otpSender = mailer.sendOtpEmailRegister;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const exist = await User.findOne({ email: email, deleted: false });
    if (exist)
        return res.status(409).json({ message: "Email already registered" });

    const resendKey = `otp:limit:${email}`;
    const otpKey = `otp:code:${email}`;

    // Block spam get OTP
    const isLimited = await redisClient.get(resendKey);
    if (isLimited)
        return res
            .status(429)
            .json({ message: "Please wait before requesting another OTP" });

    // OTP in range 100000 - 999999
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //Save OTP and limit into redis
    await redisClient.setEx(otpKey, systemConfig.otpExpiration * 60, otp);
    await redisClient.setEx(resendKey, systemConfig.otpResendLimit * 60, "1");

    otpSender(email, otp)
        .then(() => {
            console.log(`Otp: ${otp} sent to ${email}`);
        })
        .catch((err) => {
            console.error("❌ Email send error:", err);
        });
    res.json({ message: "OTP has been sent to your email" });
};

//[POST] api/v1/auth/register/verify
module.exports.registerVerify = async (req, res) => {
    const { email, password, otp, fullName, address, phone } = req.body;
    if (!email || !otp || !password || !fullName) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const storedOtp = await redisClient.get(`otp:code:${email}`);
    if (!storedOtp || storedOtp != otp) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email: email,
        password: hashedPassword,
    });

    await newUser.save();
    const newUserInfo = new UserInformation({
        email: email,
        fullName: fullName,
        address: address || "",
        phone: phone || "",
        userId: newUser._id,
    });
    await newUserInfo.save();
    await redisClient.del(`otp:code:${email}`);

    const accessToken = tokenGenerate.generateAccessToken(newUser);
    const refreshToken = tokenGenerate.generateRefreshToken(newUser);
    const sessionDate = new Date(
        Date.now() +
            systemConfig.refreshTokenExpiration.inNumber *
                24 *
                60 *
                60 *
                1000
    );
    let session = new Session({
        userId: newUser._id,
        refreshToken,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
        expiresAt: sessionDate,
    });
    await session.save();
    cookieHelper.setRefreshTokenCookie(res, refreshToken);
    console.log(`${new Date(Date.now())} --- ${email} registerd`);
    res.status(201).json(
        {
            message: "Registration successful",
            accessToken: accessToken
        }
    );
};

//[POST] api/v1/auth/refresh
module.exports.refreshPost = async (req, res) => {
    const refreshToken = req.signedCookies.refreshToken;
    
    if(!refreshToken){
        return res.status(401).json({message: "No refresh token provided"});
    }

    const {userId} = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const session = await Session.findOne({
        userId: userId,
        refreshToken: refreshToken,
        isRevoked: false
    });
    if(!session || session.expiresAt < Date.now()){
        return res.status(403).json({message: "Invalid session or token expired"});
    }
    const user = await User.findOne({
        _id: userId,
        deleted: false
    }).populate("role");
    const newAccessToken = tokenGenerate.generateAccessToken(user);
    const newRefreshToken = tokenGenerate.generateRefreshToken(user);
    // Refresh Token Rotation
    session.refreshToken = newRefreshToken;
    await session.save();
    cookieHelper.setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({accessToken: newAccessToken});
}
