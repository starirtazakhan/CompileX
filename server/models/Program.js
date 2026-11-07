const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Program title is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        sourceCode: {
            type: String,
            required: [true, "Source code is required"]
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        language: {
            type: String,
            default: "CompileX-C"
        }
    },
    {
        timestamps: true
    }
);

const Program = mongoose.model("Program", programSchema);

module.exports = Program;