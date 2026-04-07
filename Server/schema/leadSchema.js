const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },

    name: { type: String, required: true, trim: true },

    qualification: { type: String, required: true, trim: true },

    yearOfPassing: { type: String, required: true, trim: true },

    phoneNumber: { type: String, required: true, trim: true },

    location: { type: String, required: true, trim: true },

    followUpStatus: {
      type: String,
      required: true,
      trim: true,
      enum: ["Interest", "Not Interest", "Call Back", "No Response", "Call Done"],
    },

    detailsSent: {
      type: String,
      required: true,
      trim: true,
      enum: ["Yes", "No"],
    },

    assignedTo: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
      enum: ["Facebook", "Instagram", "Referral", "Ads"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
