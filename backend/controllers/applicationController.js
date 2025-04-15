const Application = require("../models/Application");
const Job = require("../models/Job");
const applyForJob = async (req, res) => {
    try {
      const { email, phone, resume, coverLetter } = req.body;
      const resumePath = req.file?.path || "";
      
      // Assuming the jobId is now passed directly from frontend
      const jobId = req.body.jobId;
  
      // Find the job using jobId (no need to check employerId here)
      const job = await Job.findOne({ _id: jobId });
  
      if (!job) {
        return res.status(404).json({ message: "Job not found." });
      }
  
      // Check if the user has already applied for this job
      const existingApplication = await Application.findOne({
        jobId: job._id,
        seekerId: req.user.id
      });
  
      if (existingApplication) {
        return res.status(400).json({ message: "You've already applied for this job." });
      }
  
      // Create the application
      const application = await Application.create({
        jobId: job._id, // Automatically assign jobId based on the found job
        seekerId: req.user.id, // Job seeker applying
        email,
        phone,
        resume: resumePath, // resume file path
        coverLetter,
      });
  
      res.status(201).json({ message: "Application submitted", application });
    } catch (err) {
      res.status(500).json({ message: "Failed to apply", error: err.message });
    }
  };
  
  

// Employer views applications for their jobs
const getApplicationsForEmployer = async (req, res) => {
    try {
      const employerId = req.user.id;
  
      // Find jobs posted by this employer
      const jobs = await Job.find({ employerId }).select("_id");
      const jobIds = jobs.map(job => job._id);
  
      // Get applications for the jobs the employer posted
      const applications = await Application.find({ jobId: { $in: jobIds } })
        .populate("seekerId", "name email skills")
        .populate("jobId", "jobTitle");
  
      res.status(200).json(applications);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch applications", error: err.message });
    }
  };
  
  // Shortlist an applicant with optional comment
const shortlistApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { employerComment } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Optional: check that the employer owns the job
    const job = await Job.findOne({ _id: application.jobId, employerId: req.user.id });
    if (!job) {
      return res.status(403).json({ message: "Not authorized to shortlist this application" });
    }

    application.shortlisted = true;
application.status = "shortlisted"; // <--- Add this line
if (employerComment) application.employerComment = employerComment;

    await application.save();

    res.status(200).json({ message: "Applicant shortlisted", application });
  } catch (err) {
    res.status(500).json({ message: "Error shortlisting applicant", error: err.message });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { employerComment } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findOne({ _id: application.jobId, employerId: req.user.id });
    if (!job) {
      return res.status(403).json({ message: "Not authorized to reject this application" });
    }

    application.status = "rejected";
    if (employerComment) application.employerComment = employerComment;

    await application.save();

    res.status(200).json({ message: "Applicant rejected", application });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting applicant", error: err.message });
  }
};
module.exports = {
  applyForJob,
  getApplicationsForEmployer,
  shortlistApplication,
  rejectApplication
};
