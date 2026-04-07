const mongoose = require("mongoose");

const customerCashSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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

module.exports = mongoose.model("CustomerCash", customerCashSchema);
