const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ["pending", "shortlisted", "rejected"],
    default: "pending"
  },
  employerComment: { type: String }
}, { timestamps: true });


module.exports = mongoose.model("Application", applicationSchema);
