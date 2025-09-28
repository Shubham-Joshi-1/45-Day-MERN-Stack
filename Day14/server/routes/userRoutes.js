const express = require("express");
const router = express.Router();
const { register, login, getMe, authMiddleware } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
