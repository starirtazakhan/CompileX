const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    req,
    action,
    resourceType,
    resourceId = null,
    details = ""
}) => {
    try {
        const auditLog = await AuditLog.create({
            user: req.user._id,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress: req.ip,
            userAgent: req.get("user-agent")
        });

        return auditLog;

    } catch (error) {
        console.error("Audit Logging Error:", error.message);
        return null;
    }
};

module.exports = { createAuditLog }; 