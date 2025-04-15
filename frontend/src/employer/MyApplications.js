import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/MyApplications.css";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleShortlist = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/applications/shortlist/${applicationId}`,
        { employerComment: comments[applicationId] || "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId ? { ...app, status: "shortlisted" } : app
        )
      );

      alert("Candidate shortlisted successfully!");
    } catch (err) {
      console.error("Failed to shortlist candidate:", err);
      alert("Something went wrong.");
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/applications/reject/${applicationId}`,
        { employerComment: comments[applicationId] || "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId ? { ...app, status: "rejected" } : app
        )
      );

      alert("Candidate rejected.");
    } catch (err) {
      console.error("Failed to reject candidate:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="applications-container">
      <h2>Applications for Your Jobs</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Resume</th>
              <th>Cover Letter</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.jobId.jobTitle}</td>
                <td>{app.seekerId.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>
                  {app.resume ? (
                    <a
                      href={`http://localhost:5000/${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    "No Resume"
                  )}
                </td>
                <td>{app.coverLetter}</td>
                <td>
                  <input
                    type="text"
                    value={comments[app._id] || app.employerComment || ""}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [app._id]: e.target.value }))
                    }
                    placeholder="Optional comment"
                    disabled={app.status === "shortlisted" || app.status === "rejected"}
                    className="comment-input"
                  />
                </td>
                <td className={`status ${app.status}`}>
                  {app.status === "shortlisted" ? (
                    <span>Shortlisted</span>
                  ) : app.status === "rejected" ? (
                    <span>Rejected</span>
                  ) : (
                    "Pending"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleShortlist(app._id)}
                    disabled={app.status !== "pending"}
                    className="action-btn shortlist"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleReject(app._id)}
                    disabled={app.status !== "pending"}
                    className="action-btn reject"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployerApplications;
