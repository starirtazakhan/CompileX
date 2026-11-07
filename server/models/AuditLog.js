const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            required: true,
            enum: [
                "PROGRAM_CREATED",
                "PROGRAM_UPDATED",
                "PROGRAM_DELETED",
                "LEXICAL_ANALYSIS",
                "SYNTAX_ANALYSIS",
                "SEMANTIC_ANALYSIS",
                "ICG_GENERATED",
                "RUN_ALL"
            ]
        },

        resourceType: {
            type: String,
            enum: ["PROGRAM", "COMPILER"],
            required: true
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        details: {
            type: String,
            trim: true,
            maxlength: 500
        },

        ipAddress: {
            type: String
        },

        userAgent: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Indexes for faster audit-log searches
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog; 