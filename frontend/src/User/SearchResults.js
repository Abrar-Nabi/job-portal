import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./styles/SearchResults.css"; // Ensure this file has the updated unique CSS classes
import Navbar from "../components/Auth/Navbar";
import JobApplicationForm from "../User/JobApplyForm"; // ✅ Import the form

const SearchResults = () => {
    const location = useLocation();
  const results = (location.state?.results || []).filter(job => job.isActive);


    const [selectedJobId, setSelectedJobId] = useState(null); // ✅ Track selected job
    const [showModal, setShowModal] = useState(false); // ✅ Control modal visibility

    const handleApplyClick = (jobId) => {
        setSelectedJobId(jobId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Navbar />
            <div className="search-results-page-unique">
                <h2>Search Results</h2>
                {results.length === 0 ? (
                    <p className="no-results-unique">No results found.</p>
                ) : (
                    results.map((job, idx) => (
                        <div key={idx} className="job-card-unique">
                            <h3 className="job-title-unique">
                                {job.jobTitle || "Job Title Unavailable"}
                            </h3>
                            <div className="company-name-unique">
                                <strong>Company: </strong>
                                {job.employerId?.companyName || "N/A"}
                            </div>
                            <div className="job-meta-unique">
                                <div className="job-location-unique">
                                    <strong>Location:</strong> {job.location || "N/A"}
                                </div>
                                <div className="job-category-unique">
                                    <strong>Category:</strong> {job.jobCategory || "N/A"}
                                </div>
                                <div className="job-experience-unique">
                                    <strong>Experience Level:</strong> {job.experienceLevel || "N/A"}
                                </div>
                                <div className="job-employment-type-unique">
                                    <strong>Employment Type:</strong> {job.employmentType || "N/A"}
                                </div>
                                <div className="application-deadline-unique">
                                    <strong>Application Deadline:</strong>{" "}
                                    {job.applicationDeadline
                                        ? new Date(job.applicationDeadline).toLocaleDateString()
                                        : "N/A"}
                                </div>
                                <div className="salary-unique">
                                    <strong>Salary:</strong> {job.monthlySalary || "N/A"}
                                </div>
                                <div className="job-details-unique">
                                    <strong>Job Details:</strong> {job.jobDetails || "N/A"}
                                </div>
                            </div>
                            <div className="posted-unique">
                                Date Posted{" "}
                                {Math.floor(
                                    (new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24)
                                )}{" "}
                                days ago
                            </div>
                            <div className="job-right-unique">
                                <button
                                    className="apply-btn-unique"
                                    onClick={() => handleApplyClick(job._id)}
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ✅ Modal with JobApplicationForm */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <JobApplicationForm jobId={selectedJobId} />
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchResults;
