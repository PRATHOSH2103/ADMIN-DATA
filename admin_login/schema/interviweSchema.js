const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    interviewDate: {
      type: Date,
      required: true,
    },
    intervieweeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    yearOfPassing: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    followUpStatus: {
      type: String,
      required: true,
    },
    scheduleDate: {
      type: Date,
      required: true,
    },
    jobrole: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    uploadPhoto: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);