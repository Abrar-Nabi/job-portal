import React, { useState } from "react";
import ApproveEmployers from "./ApproveEmployers";
import ViewEmployers from "./ViewEmployers";

import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("approve");

  const renderContent = () => {
    switch (activeTab) {
      case "approve":
        return <ApproveEmployers />;
      case "employers":
        return <ViewEmployers />;
    
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <>

      <div className="admin-dashboard">
        <aside className="admin-sidebar">

          <ul>
            <li onClick={() => setActiveTab("approve")}>Approve Employers</li>
            <li onClick={() => setActiveTab("employers")}>View Employers</li>
         
       
          </ul>
        </aside>
        <main className="admin-main">{renderContent()}</main>
      </div>
    </>
  );
};

export default AdminDashboard;
