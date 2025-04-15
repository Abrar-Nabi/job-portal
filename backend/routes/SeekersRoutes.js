const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const JobSeeker = require("../models/JobSeeker");
const Application = require("../models/Application");
const upload = require("../middleware/upload"); // Multer middleware

const router = express.Router();

// ✅ Get all applications for the logged-in job seeker
router.get("/applications", verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user.id })
      .populate("jobId", "jobTitle")
      .populate("seekerId", "name email skills");

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
});

// ✅ Update status of a job application (shortlist/reject)
router.put("/applications/:applicationId", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (["rejected", "shortlisted"].includes(status)) {
      application.status = status;
      await application.save();
      res.status(200).json(application);
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating application status", error: err.message });
  }
});

module.exports = router;
