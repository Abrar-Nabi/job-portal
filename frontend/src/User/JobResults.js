import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Auth/Navbar";
import JobApplicationForm from "../User/JobApplyForm"; // adjust path if needed

const JobResults = () => {
    const { keyword } = useParams();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleApplyClick = (jobId) => {
        setSelectedJobId(jobId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/jobs/search?keyword=${keyword}`)
            .then((res) => {
                const filteredJobs = res.data.filter((job) =>
                    job.jobCategory.toLowerCase().includes(keyword.toLowerCase())
                );
                setJobs(filteredJobs);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch jobs", err);
                setLoading(false);
            });
    }, [keyword]);

    return (
        <>
            <Navbar />
            <div className="job-results-container search-results-page-unique">
                <h2 className="section-title">
                    {keyword === "all" ? "All Jobs" : `Jobs for "${keyword}"`}
                </h2>

                {loading ? (
                    <p>Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p>No jobs found for "{keyword}"</p>
                ) : (
                    <div className="jobs-container">
                        {jobs.map((job) => (
                            <div key={job._id} className="job-card-unique">
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
                        ))}
                    </div>
                )}
            </div>

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

export default JobResults;
