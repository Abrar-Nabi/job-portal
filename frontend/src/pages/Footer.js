import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";  // Assuming you will add styles for the footer
import { getUserInfo } from "../utils/auth";
const Footer = () => {
  const navigate = useNavigate();
  const user = getUserInfo();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h2 className="footer-site-name" onClick={() => navigate("/home")}>
            HireNest
          </h2>
          <p>&copy; {new Date().getFullYear()} HireNest. All Rights Reserved.</p>
        </div>

        <div className="footer-right">
        <button className="explore-btn" onClick={() => navigate("/all-jobs")}>
          Explore All Jobs
        </button>
        {user?.role === "seeker" && (
          <button className="explore-btn" onClick={() => navigate(`/myapplications`)}>
            My applications
          </button>
        )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
