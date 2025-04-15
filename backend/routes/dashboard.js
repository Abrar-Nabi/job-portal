const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const mongoose = require('mongoose');
const router = express.Router();

// Helper function to get today's date
const getTodayStartDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

router.get('/dashboard-stats', async (req, res) => {
    try {
      // Get today's start date for filtering new applications
      const todayStartDate = getTodayStartDate();
  
      // Total Jobs Posted
      const totalJobs = await Job.countDocuments();
  
      // Active Jobs
      const activeJobs = await Job.countDocuments({ isActive: true });
  
      // New Applications Today
      const newApplications = await Application.countDocuments({
        createdAt: { $gte: todayStartDate }
      });
  
      // Total Applicants (distinct seekers)
      const totalApplicants = await Application.distinct('seekerId').countDocuments();
  
      // Pending Applications
      const pendingApplications = await Application.countDocuments({ status: "pending" });
  
      // Top Job (Example: Job with the most applications today, can be adjusted as needed)
      const topJob = await Application.aggregate([
        {
          $match: { createdAt: { $gte: todayStartDate } }
        },
        {
          $group: {
            _id: "$jobId",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
  
      // Top Job Title (if exists)
      const topJobTitle = topJob.length > 0 ? await Job.findById(topJob[0]._id) : null;
  
      // Handling null or empty top job title
      const topJobTitleName = topJobTitle ? topJobTitle.jobTitle : "N/A";
  
      // Emails Sent (Example: could count sent emails via some other service, or from an 'emailsSent' field in a job posting)
      const emailsSent = 0; // This is a placeholder; adjust as needed based on your logic
  
      // Sending response
      res.json({
        totalJobs,
        activeJobs,
        newApplications,
        totalApplicants,
        pendingApplications,
        topJob: topJobTitleName,
        emailsSent
      });
  
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  });
  

module.exports = router;
