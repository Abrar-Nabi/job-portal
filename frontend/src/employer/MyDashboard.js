import React, { useState, useEffect } from 'react';

import "./styles/Dashboard.css";
import { getUserInfo } from "../utils/auth";
const Dashboard = () => {

  const [stats, setStats] = useState({
   
    totalJobs: 0,
    activeJobs: 0,
    newApplications: 0,
    totalApplicants: 0,
    pendingApplications: 0,
    topJob: '',
    emailsSent: 0,
  });
  const user = getUserInfo(); 

  useEffect(() => {
    // Fetch company name from localStorage
    const companyName = localStorage.getItem('companyName');
    if (companyName) {
      setStats(prevStats => ({ ...prevStats, companyName }));
    }

    // Fetch other dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employer/dashboard-stats', {
        credentials: 'include',
      });
      const data = await res.json();
      setStats(prevStats => ({
        ...prevStats,
        totalJobs: data.totalJobs,
        activeJobs: data.activeJobs,
        newApplications: data.newApplications,
        totalApplicants: data.totalApplicants,
        pendingApplications: data.pendingApplications,
        topJob: data.topJob,
        emailsSent: data.emailsSent,
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };



  return (
    <div className="dashboard-container">
      {/* Display company name if available */}
      <h2>Welcome to {user.name || "Your Company"} Dashboard</h2>

      {/* Dashboard Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalJobs}</h3>
          <p>Total Jobs Posted</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeJobs}</h3>
          <p>Active Jobs</p>
        </div>
        <div className="stat-card">
          <h3>{stats.newApplications}</h3>
          <p>New Applications Today</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalApplicants}</h3>
          <p>Total Applicants</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingApplications}</h3>
          <p>Pending Applications</p>
        </div>
      </div>

    
    </div>
  );
};

export default Dashboard;
