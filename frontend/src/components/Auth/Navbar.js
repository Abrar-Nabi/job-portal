import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, removeToken } from "../../utils/auth";
import "../../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = getUserInfo();
    if (currentUser) {
      setUser(currentUser);
    } else {
      removeToken();
      navigate("/login");
    }

    // Timer for inactivity (15 minutes = 900,000 ms)
    let inactivityTimer;
    
    // Function to handle logout after inactivity
    const handleInactivity = () => {
      removeToken(); // Clear user info and token
      navigate("/login"); // Redirect to login
    };

    // Reset inactivity timer on any user activity (mouse move, key press, etc.)
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      inactivityTimer = setTimeout(handleInactivity, 15 * 60 * 1000); // 15 minutes
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Set the initial inactivity timer
    resetInactivityTimer();

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      clearTimeout(inactivityTimer); // Clear the timer if component is unmounted
    };
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="site-name" onClick={() => navigate("/home")}>
          HireNest
        </h2>
      </div>
      <div className="navbar-right" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {/* Only show Profile button if the role is 'seeker' */}
        {user?.role === "seeker" && (
          <button className="explore-btn" onClick={() => navigate(`/myapplications`)}>
            My applications
          </button>
        )}
        <img
          src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="User"
          className="user-icon"
        />
        <span className="user-name">{user?.name || " "}</span>

        <span className="dropdown-arrow">&#9662;</span>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
