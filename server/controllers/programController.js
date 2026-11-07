const mongoose = require("mongoose");
const Program = require("../models/Program");
const { createAuditLog } = require("../services/auditService");

// CREATE PROGRAM
const createProgram = async (req, res) => {
    try {
        const { title, sourceCode } = req.body;

        if (!title || !sourceCode) {
            return res.status(400).json({
                success: false,
                message: "Title and source code are required."
            });
        }

        const program = await Program.create({
            title,
            sourceCode,
            owner: req.user._id
        });

        await createAuditLog({
    req,
    action: "PROGRAM_CREATED",
    resourceType: "PROGRAM",
    resourceId: program._id,
    details: `Created program: ${program.title}`
});

        res.status(201).json({
            success: true,
            message: "Program created successfully.",
            program
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL USER PROGRAMS
const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find({
            owner: req.user._id
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: programs.length,
            programs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE PROGRAM
const getProgramById = async (req, res) => {
    try {
        const { id } = req.params;

       if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid program ID."
            });
        }

        const program = await Program.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found."
            });
        }

        res.status(200).json({
            success: true,
            program
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE PROGRAM
const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, sourceCode } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid program ID."
            });
        }

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (sourceCode !== undefined) updates.sourceCode = sourceCode;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide a title or source code to update."
            });
        }

        const program = await Program.findOneAndUpdate(
            {
                _id: id,
                owner: req.user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found."
            });
        }

        await createAuditLog({
    req,
    action: "PROGRAM_UPDATED",
    resourceType: "PROGRAM",
    resourceId: program._id,
    details: `Updated program: ${program.title}`
}); 

        res.status(200).json({
            success: true,
            message: "Program updated successfully.",
            program
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE PROGRAM
const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

       if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid program ID."
            });
        }

        const program = await Program.findOneAndDelete({
            _id: id,
            owner: req.user._id
        });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found."
            });
        }

        await createAuditLog({
    req,
    action: "PROGRAM_DELETED",
    resourceType: "PROGRAM",
    resourceId: program._id,
    details: `Deleted program: ${program.title}`
});

        res.status(200).json({
            success: true,
            message: "Program deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
}; 