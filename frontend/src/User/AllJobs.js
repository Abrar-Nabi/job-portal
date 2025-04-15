import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import axios from "axios";
import "./styles/RecentJobListing.css"; // optional for styling
import Navbar from "../components/Auth/Navbar";
import JobApplicationForm from "../User/JobApplyForm"; // Import your form component

const RecentJobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null); // Track the selected job
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  useEffect(() => {
    // Fetching recent jobs from the backend API
    axios
      .get("http://localhost:5000/api/jobs/recent") // Ensure this is the correct URL for your backend
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs.");
        setLoading(false);
      });
  }, []);

  const handleApplyClick = (jobId) => {
    console.log("Job ID selected:", jobId); // Log jobId
    setSelectedJobId(jobId); // Set the selected job's ID
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <section className="recent-jobs-section">
      <h3>All Posted Jobs</h3>
        <div className="jobs-container">
          {jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-left">
                <div>
                  <h3 className="job-title">{job.jobTitle}</h3>
                  <h3 className="job-title">{job.employerId?.companyName || "N/A"}</h3>
                  
                  <div className="job-meta">
                    <span
                      className={`employment-type ${job.employmentType
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {job.employmentType}
                    </span>
                    <span className="location">
                      <FaMapMarkerAlt /> {job.location}
                    </span>
                    <span className="posted">
                      <FaClock />{" "}
                      {Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))}{" "}
                      days ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="job-right">
                <div className="salary">{job.salary}</div>
                <button className="apply-btn" onClick={() => handleApplyClick(job._id)}>
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for applying */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>
              &times;
            </span>
            <JobApplicationForm jobId={selectedJobId} /> {/* Pass jobId to the form */}
          </div>
        </div>
      )}
    </>
  );
};

export default RecentJobListing;
