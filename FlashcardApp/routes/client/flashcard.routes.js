const express = require("express");
// Middleware
const santinizeQuery = require("../../middlewares/santinizeQuery.middleware");
const router = express.Router();
const controller = require("../../controllers/client/flashcard.controller");

router.get("/search", santinizeQuery, controller.search);


module.exports = router;