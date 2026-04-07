


const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  date: { type: Date, required: true },
  state: { type: String, required: true },
  InvoiceNo: { type: String, required: true, unique: true },
  GSTIN: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema); // ✅ MUST be model
