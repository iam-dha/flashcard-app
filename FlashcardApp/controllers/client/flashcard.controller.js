// Model
const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const Flashcard = require("../../models/flashcard.model");
const UserInformation = require("../../models/userInformation.model");

module.exports.search = async (req, res) => {
    console.log(req.query);

    res.json({message: "Tam OK"});
}