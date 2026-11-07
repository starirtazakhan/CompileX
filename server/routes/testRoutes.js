const express = require("express");

const router = express.Router();

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// Accessible to ADMIN, ANALYST and VIEWER
router.get(
    "/all",
    protect,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    (req, res) => {
        res.json({
            success: true,
            message: "All authenticated users can access this route.",
            role: req.user.role
        });
    }
);


// Accessible to ADMIN and ANALYST
router.get(
    "/analyst",
    protect,
    authorize("ADMIN", "ANALYST"),
    (req, res) => {
        res.json({
            success: true,
            message: "Analyst access granted.",
            role: req.user.role
        });
    }
);


// Accessible only to ADMIN
router.get(
    "/admin",
    protect,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "Administrator access granted.",
            role: req.user.role
        });
    }
);


module.exports = router;