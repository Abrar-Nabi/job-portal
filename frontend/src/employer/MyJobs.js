import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Myjobs.css"; // You'll create this for styling the modal

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/employer/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/employer/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:5000/api/employer/jobs/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchJobs();
    } catch (error) {
      console.error("Error toggling job status:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (job) => {
    setFormData({
      jobTitle: job.jobTitle,
      jobCategory: job.jobCategory,
      monthlySalary: job.monthlySalary,
      location: job.location,
      experienceLevel: job.experienceLevel,
      employmentType: job.employmentType,
      positions: job.positions,
      jobDetails: job.jobDetails,
      skills: job.skills,
      applicationDeadline: job.applicationDeadline?.split("T")[0] || ""
    });
    setCurrentJobId(job._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentJobId(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/employer/jobs/${currentJobId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Job updated successfully");
      closeModal();
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="my-jobs">
      <h2>Your Posted Jobs</h2>
      <ul className="job-list">
        {jobs.map((job) => (
          <li key={job._id} className="job-item">
            <h4>{job.jobTitle}</h4>
            <p>{job.jobCategory}</p>
            <p>Salary: {job.monthlySalary}</p>
            <p>Location: {job.location}</p>
            <p>
              Deadline:{" "}
              {new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>

            <p>Positions: {job.positions}</p>
            <p>Status: {job.isActive ? "Active" : "Inactive"}</p>

            <div className="btn-group">
              <button className="btn edit" onClick={() => openModal(job)}>Edit</button>
              <button className="btn delete" onClick={() => handleDelete(job._id)}>Delete</button>
              <button
                className={`btn ${job.isActive ? "deactivate" : "activate"}`}
                onClick={() => handleToggleStatus(job._id)}
              >
                {job.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>

          </li>
        ))}
      </ul>

      {/* Modal for Editing Job */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Job</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-row">
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                <input type="text" name="jobCategory" value={formData.jobCategory} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <input type="text" name="monthlySalary" value={formData.monthlySalary} onChange={handleChange}  />
                <input type="text" name="location" value={formData.location} onChange={handleChange}  />
              </div>

              <div className="form-row">
                <input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}  />
                <input type="text" name="employmentType" value={formData.employmentType} onChange={handleChange}  />
              </div>

              <div className="form-row">
                <input type="number" name="positions" value={formData.positions} onChange={handleChange}  />
                <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange}  />
              </div>

              <textarea name="jobDetails" value={formData.jobDetails} onChange={handleChange}  />
              <input type="text" name="skills" value={formData.skills} onChange={handleChange}  />

              <div className="btn-group">
                <button className="btn edit" type="submit">Update Job</button>
                <button className="btn delete" type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
