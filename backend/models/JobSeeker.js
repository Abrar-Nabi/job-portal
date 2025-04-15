const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔥 This is required for login
  phone: { type: String },
  skills: { type: [String] },
  education: { type: String },
  location: { type: String },
  profilePicture: { type: String }, // Path to profile picture
  jobApplications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
  ]
}, { timestamps: true });

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
