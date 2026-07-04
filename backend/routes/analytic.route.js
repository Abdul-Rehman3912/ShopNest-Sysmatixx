const express = require("express");
const { getAdminStats } = require("../controllers/analytic.controller");
const { protectRoute } = require("../middlewares/auth.middleware");
const { admin } = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", protectRoute, admin, getAdminStats);

module.exports = router;
