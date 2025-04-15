// applicationRoutes.js
const express = require("express");
const { applyForJob, getApplicationsForEmployer } = require("../controllers/applicationController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();
const { shortlistApplication, rejectApplication } = require("../controllers/applicationController");

// Route to shortlist an applicant (employer only)
router.put("/shortlist/:applicationId", verifyToken, requireRole("employer"), shortlistApplication);
router.put("/reject/:applicationId", verifyToken, rejectApplication);


// Job Seeker applies for a job
router.post("/apply", verifyToken, requireRole("seeker"), upload.single("resume"), applyForJob);

// Get applications for the employer (if needed)
router.get("/my-applications", verifyToken, requireRole("employer"), getApplicationsForEmployer);

module.exports = router;
