const mongoose = require("mongoose");
const { type } = require("os");

const userInformation_schema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        thumbnail: {
            type: String,
            default: "https://www.thekaratelifestyle.com/wp-content/uploads/2024/01/miyamoto-musashi-the-retainer.jpg"
        },
        totalScore:{
            type: Number,
            default: 0
        },
        address: String,
        phone: {
            type: String,
            default: "",
        },
        deleted: {
            type: Boolean, 
            default: false
        },
        status: {
            type: String,
            default: "active"
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const UserInformation = mongoose.model("UserInformation", userInformation_schema, "userInformation");
module.exports = UserInformation;