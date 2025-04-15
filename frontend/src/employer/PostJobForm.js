import React, { useState } from "react";
import axios from "axios";
import "./styles/PostJobs.css"; // Make sure this CSS file exists

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobCategory: "",
    monthlySalary: "",
    location: "",
    experienceLevel: "",
    employmentType: "",
    positions: "",
    jobDetails: "",
    skills: "",
    applicationDeadline: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim())
      };

      await axios.post("http://localhost:5000/api/employer/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Job posted successfully!");

      // ✅ Reset form
      setFormData({
        jobTitle: "",
        jobCategory: "",
        monthlySalary: "",
        location: "",
        experienceLevel: "",
        employmentType: "",
        positions: "",
        jobDetails: "",
        skills: "",
        applicationDeadline: ""
      });

    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-job-form">
      <h2>Post a Job</h2>

      {/* Row 1 */}
      <div className="form-row">
        <div className="form-group">
          <label>Job Title</label>
          <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Job Category</label>
          <select name="jobCategory" value={formData.jobCategory} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Accounting">Accounting</option>
            <option value="Commercial">Commercial</option>
            <option value="IT & Technology">IT & Technology</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Support Service">Support Service</option>
            <option value="UI Designer">UI Designer</option>
            <option value="UX Designer">UX Designer</option>
            {/* You can add more categories here if necessary */}
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="form-row">
        <div className="form-group">
          <label>Monthly Salary</label>
          <input type="text" name="monthlySalary" value={formData.monthlySalary} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
      </div>

      {/* Row 3 */}
      <div className="form-row">
        <div className="form-group">
          <label>Experience Level</label>
 
          <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
            <option value="">Select Experience Level</option>
            <option value="Fresher">Fresher</option>
            <option value="1-2 years">1-2 years</option>
            <option value="more than 3 years">more than 3 years</option>
            </select>
        </div>
        <div className="form-group">
          <label>Employment Type</label>

          <select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
            <option value="">Select employment Type</option>
            <option value="Full Time">Full time</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            </select>
        </div>
      </div>

      {/* Row 4 */}
      <div className="form-row">
        <div className="form-group">
          <label>No. of Positions</label>
          <input type="text" name="positions" value={formData.positions} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Application Deadline</label>
          <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required />
        </div>
      </div>

      {/* Row 5 */}
      <div className="form-group">
        <label>Skills (comma-separated)</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange}  />
      </div>

      {/* Row 6 */}
      <div className="form-group">
        <label>Job Details</label>
        <textarea name="jobDetails" value={formData.jobDetails} onChange={handleChange} required rows="4" />
      </div>

      <button type="submit" className="submit-btn">Post Job</button>
    </form>
  );
};

export default PostJobForm;
