const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
    try {
        let { page = 1, limit = 10, action, userId } = req.query;

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.min(100, Math.max(1, parseInt(limit) || 10));

        const filter = {};

        if (action) {
            filter.action = action;
        }

        if (userId) {
            filter.user = userId;
        }

        const totalLogs = await AuditLog.countDocuments(filter);

        const logs = await AuditLog.find(filter)
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            success: true,
            totalLogs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            logs
        });

    } catch (error) {
        console.error("Audit Logs Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve audit logs."
        });
    }
};

module.exports = { getAuditLogs };