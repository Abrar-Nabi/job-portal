// routes/filters.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Employer = require("../models/Employer");

// GET all dropdown filters
router.get("/filters", async (req, res) => {
  try {
    const companyNames = await Employer.find({}, "companyName _id");
    const locations = await Job.distinct("location");
    const experienceLevels = await Job.distinct("experienceLevel");
    const employmentTypes = await Job.distinct("employmentType");

    res.json({
      companyNames,
      locations,
      experienceLevels,
      employmentTypes,
    });
  } catch (err) {
    console.error("Error fetching filters:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
