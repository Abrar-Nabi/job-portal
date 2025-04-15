const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Employer = require("../models/Employer")
// Define your routes here...
router.get("/recent", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("employerId", "companyName"); // <--- Add this line

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching recent jobs." });
  }
});



// routes/jobRoutes.js
router.get("/search", async (req, res) => {
  try {
    const filters = { isActive: true }; // ✅ Ensure only active jobs are fetched


    if (req.query.companyName) {
      const employer = await Employer.findOne({
        companyName: { $regex: new RegExp(req.query.companyName, 'i') }
      });
      if (employer) {
        filters.employerId = employer._id;
        console.log("Employer found:", employer);
      } else {
        return res.status(404).json({ error: "Company not found" });
      }
    }

    if (req.query.location) {
      filters.location = req.query.location;
    }

    if (req.query.experienceLevel) {
      filters.experienceLevel = req.query.experienceLevel;
    }

    if (req.query.employmentType) {
      filters.employmentType = req.query.employmentType;
    }

    console.log("Filters after processing:", filters);

    const jobs = await Job.find(filters).populate("employerId", "companyName");

    console.log("Found jobs:", jobs);

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error in search route:", err);
    res.status(500).json({ error: "Server error" });
  }
});


  

// @desc Get job count by category
// @route GET /api/jobs/count-by-category
router.get("/count-by-category", async (req, res) => {
    try {
      const counts = await Job.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: "$jobCategory",
            count: { $sum: 1 }
          }
        }
      ]);
      res.status(200).json(counts);
    } catch (error) {
      res.status(500).json({ error: "Server error while counting jobs." });
    }
  });
  


// Export the router
module.exports = router;
