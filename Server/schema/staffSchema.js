const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({

    staffName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    dateOfJoining: {
        type: Date,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    comments: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);