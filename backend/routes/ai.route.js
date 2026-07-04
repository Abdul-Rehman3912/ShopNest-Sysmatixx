const express = require("express");
const { aiSearch } = require("../controllers/aiController");
const { protectRoute } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/ai/search", protectRoute, aiSearch);

module.exports = router;