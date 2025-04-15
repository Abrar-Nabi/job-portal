const Job = require("../models/Job");
const Employer = require("../models/Employer");

const postJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobCategory,
      monthlySalary,
      location,
      experienceLevel,
      employmentType,
      positions,
      jobDetails,
      skills,
      applicationDeadline
    } = req.body;

    // Fetch employer details
    const employer = await Employer.findById(req.user.id);
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    const newJob = new Job({
      jobTitle,
      jobCategory,
      monthlySalary,
      location,
      experienceLevel,
      employmentType,
      positions,
      jobDetails,
      skills,
      applicationDeadline,
      employerId: req.user.id,
      companyName: employer.companyName, // 👈 ADD THIS LINE
      isActive: true
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
};


// Get all jobs posted by employer
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employerId: req.user.id
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, employerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job updated", job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// Toggle job status (active/inactive)
const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employerId: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.isActive = !job.isActive;
    await job.save();
    res.status(200).json({ message: "Job status updated", isActive: job.isActive });
  } catch (err) {
    res.status(500).json({ message: "Error toggling job status", error: err.message });
  }
};




const searchJobs = async (req, res) => {
  try {
    const { companyName, location, experienceLevel, employmentType } = req.query;

    const filter = { isActive: true };  // Filter for only active jobs

    if (companyName) filter["companyName"] = companyName;
    if (location) filter["location"] = location;
    if (experienceLevel) filter["experienceLevel"] = experienceLevel;
    if (employmentType) filter["employmentType"] = employmentType;

    const jobs = await Job.find(filter);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error searching jobs", error: err.message });
  }
};


module.exports = {
  searchJobs,
  postJob,
  getMyJobs,
  deleteJob,
  updateJob,
  toggleJobStatus
};

