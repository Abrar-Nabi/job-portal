import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Employers.css";

const ViewEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);

  const fetchEmployers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/all-employers");
      setEmployers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employers.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployer = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this employer?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-employer/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchEmployers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employer.");
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/edit-employer/${editData._id}`,
        {
          companyName: editData.companyName,
          email: editData.email,
          location: editData.location,
          industry: editData.industry,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditData(null);
      fetchEmployers();
    } catch (err) {
      console.error(err);
      alert("Failed to update employer.");
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  return (
    <div className="employers-container">
      <h2>All Employers</h2>
      <button className="refresh-btn" onClick={fetchEmployers}>
        Refresh
      </button>

      {loading && <p>Loading employers...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <table className="employers-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Status</th>
              <th>Location</th>
              <th>Industry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.companyName}</td>
                <td>{emp.email}</td>
                <td>
                  <span
                    className={`status-badge ${
                      emp.isApproved ? "status-approved" : "status-pending"
                    }`}
                  >
                    {emp.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>{emp.location}</td>
                <td>{emp.industry || "-"}</td>
                <td>
                  <button onClick={() => setEditData(emp)}>Edit</button>
                  <button onClick={() => deleteEmployer(emp._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editData && (
  <div className="edit-popup">
    <div className="edit-form">
      <h3>Edit Employer</h3>
      <input
        type="text"
        name="companyName"
        value={editData.companyName}
        onChange={handleEditChange}
        placeholder="Company Name"
      />
      <input
        type="email"
        name="email"
        value={editData.email}
        onChange={handleEditChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="location"
        value={editData.location}
        onChange={handleEditChange}
        placeholder="Location"
      />
      <input
        type="text"
        name="industry"
        value={editData.industry}
        onChange={handleEditChange}
        placeholder="Industry"
      />
      <div>
        <button onClick={submitEdit}>Save</button>
        <button className="cancel-btn" onClick={() => setEditData(null)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ViewEmployers;
