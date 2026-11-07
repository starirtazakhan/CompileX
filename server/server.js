const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const programRoutes = require("./routes/programRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const auditRoutes = require("./routes/auditRoutes");

// Initialize Express BEFORE using app.use()
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CompileX Express Server is running."
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// RBAC testing routes
app.use("/api/test", testRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/audit-logs", auditRoutes);

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect database and start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `CompileX Server running on http://localhost:${PORT}`
        );
    });
};

startServer();