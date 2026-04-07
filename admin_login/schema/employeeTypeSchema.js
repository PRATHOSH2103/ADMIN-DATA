// models/EmployeeType.js
const mongoose = require("mongoose");


const employeeTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    }
});


module.exports = mongoose.model("EmployeeType", employeeTypeSchema);
