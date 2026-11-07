const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const {
    protect
} = require("../middleware/authMiddleware");


// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/me", protect, getProfile);


module.exports = router;