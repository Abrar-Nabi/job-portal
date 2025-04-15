const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: String,
  industry: String,
  isApproved: { type: Boolean, default: false },
  password: { type: String, required: true },  // Add password field
}, { timestamps: true });

module.exports = mongoose.model("Employer", employerSchema);
