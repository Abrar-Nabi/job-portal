const express = require("express");
const router = express.Router();
const {
  postJob,
  getMyJobs,
  deleteJob,
  updateJob,
  toggleJobStatus,
  searchJobs
} = require("../controllers/employerController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// POST a job
router.post("/jobs", verifyToken, requireRole("employer"), postJob);

// GET all jobs by logged-in employer
router.get("/jobs", verifyToken, requireRole("employer"), getMyJobs);

// DELETE a job
router.delete("/jobs/:id", verifyToken, requireRole("employer"), deleteJob);

// UPDATE a job
router.put("/jobs/:id", verifyToken, requireRole("employer"), updateJob);

// TOGGLE isActive (stop/restart hiring)
router.patch("/jobs/:id/toggle", verifyToken, requireRole("employer"), toggleJobStatus);


router.get("/search-jobs", searchJobs); // Public route, no auth needed

module.exports = router;
