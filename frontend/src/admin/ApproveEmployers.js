import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Employers.css"; // using the same CSS file

const ApproveEmployers = () => {
  const [pendingEmployers, setPendingEmployers] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/pending-employers");
        setPendingEmployers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-employer/${id}`);
      setPendingEmployers((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="employers-container">
      <h2>Pending Employers</h2>
      {pendingEmployers.length === 0 ? (
        <p className="empty-message">No pending approvals.</p>
      ) : (
        <table className="employers-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Location</th>
              <th>Industry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingEmployers.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.companyName}</td>
                <td>{emp.email}</td>
                <td>{emp.location}</td>
                <td>{emp.industry}</td>
                <td>
                  <button className="approve-btn" onClick={() => handleApprove(emp._id)}>
                    Approve
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

export default ApproveEmployers;
