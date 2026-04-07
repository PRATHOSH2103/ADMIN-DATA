const mongoose = require("mongoose");

const studentCashSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    currentBalance: { type: Number, required: true },
    paidAmount: { type: Number, required: true },

    remainingAmount: { type: Number, required: true },

    paymentType: {
      type: String,
      enum: ["Cash", "Bank", "Online"],
      required: true,
    },

    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentCash", studentCashSchema);
