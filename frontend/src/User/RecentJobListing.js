import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import axios from "axios";
import JobApplicationForm from "../User/JobApplyForm"; // Adjust path if needed
import "./styles/RecentJobListing.css";

const RecentJobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs/recent")
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section className="recent-jobs-section">
        <h2 className="section-title">Recent Job Listing</h2>
        <p className="section-subtitle">
          Search all the open positions on the web. Get your own personalized salary estimate. <br />
          Read reviews on over 30000+ companies worldwide.
        </p>

        <div className="jobs-container">
          {jobs.slice(0, 4).map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-left">
                <h3 className="job-title">{job.jobTitle}</h3>
                <h3 className="job-title">{job.employerId?.companyName || "N/A"}</h3>
                <div className="job-meta">
                  <span className={`employment-type ${job.employmentType.toLowerCase().replace(" ", "-")}`}>
                    {job.employmentType}
                  </span>
                  <span className="location">
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <span className="posted">
                    <FaClock /> {Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                </div>
              </div>
              <div className="job-right">
                <div className="salary">₹{job.monthlySalary}</div>
                <button className="apply-btn" onClick={() => setSelectedJob(job)}>
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setSelectedJob(null)}>&times;</span>
            <JobApplicationForm jobId={selectedJob._id} />
          </div>
        </div>
      )}
    </>
  );
};

export default RecentJobListing;
