import React, { useState } from "react";
import EmployerHome from "../employer/MyDashboard";
import PostJob from "../employer/PostJobForm";
import MyJobs from "../employer/MyJobs";
import Applications from "../employer/MyApplications";
import "../styles/employerDashboard.css"

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <EmployerHome />;
      case "post":
        return <PostJob />;
      case "jobs":
        return <MyJobs />;
      case "applications":
        return <Applications />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="employer-dashboard">
      <aside className="employer-sidebar">
        <ul>
          <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveTab("post")}>Post a Job</li>
          <li onClick={() => setActiveTab("jobs")}>My Jobs</li>
          <li onClick={() => setActiveTab("applications")}>Applications</li>
        </ul>
      </aside>
      <main className="employer-main">{renderContent()}</main>
    </div>
  );
};

export default EmployerDashboard;
