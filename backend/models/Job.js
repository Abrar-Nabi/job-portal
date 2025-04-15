// models/Job.js
const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobCategory: String,
    monthlySalary: String,
    location: String,
    experienceLevel: String,
    employmentType: String,
    positions: Number,
    jobDetails: String,
    skills: [String],
    applicationDeadline: Date,
    isActive: { type: Boolean, default: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    companyName: String, // 👈 ADD THIS LINE
  },
  { timestamps: true }
);


module.exports = mongoose.model("Job", jobSchema);
