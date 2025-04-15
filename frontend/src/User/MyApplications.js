import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/JobSeekerProfile.css"; // Import the CSS file
import Navbar from "../components/Auth/Navbar";

const JobSeekerProfile = () => {
  const [applications, setApplications] = useState([]);

  // Fetch profile data on load
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/jobseeker/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    fetchApplications();
  }, []);


  return (
    <>
    <Navbar/>
    <div className="job-seeker-profile">
      <div className="job-seeker-profile-container">
        <h2>Applications</h2>
        <table className="job-seeker-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Status</th>
              <th>Employer Comment</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.jobId.jobTitle}</td>
                <td>{app.status}</td>
                <td>{app.employerComment || "No comment"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></>
  );
};

export default JobSeekerProfile;
