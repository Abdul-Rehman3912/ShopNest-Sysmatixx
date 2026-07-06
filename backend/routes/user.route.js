const express = require("express");
const {
  signup,
  login,
  logout,
  updateUserRole,
  AllUsers,
} = require("../controllers/user.controller.js");
const { protectRoute } = require("../middlewares/auth.middleware.js");
const { admin } = require("../middlewares/admin.middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getAll", protectRoute, admin, AllUsers);
router.route("/:id/role").put(protectRoute, admin, updateUserRole);
router.post("/logout", logout);

module.exports = router;
