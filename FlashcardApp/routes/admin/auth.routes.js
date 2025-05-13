const express = require("express");

const controller = require("../../controllers/admin/auth.controller");

const router = express.Router();

router.post("/login", controller.loginPost);

module.exports = router;
