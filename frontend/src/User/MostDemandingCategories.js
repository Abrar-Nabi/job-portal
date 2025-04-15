import React, { useEffect, useState } from "react";
import {
  FaCalculator,
  FaBuilding,
  FaLaptopCode,
  FaChartLine,
  FaHeadset,
  FaPaintBrush,
  FaUserCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/MostDemandingCategories.css";

const icons = {
  Accounting: <FaCalculator />,
  Commercial: <FaBuilding />,
  "IT & Technology": <FaLaptopCode />,
  "Sales & Marketing": <FaChartLine />,
  "Support Service": <FaHeadset />,
  "UI Designer": <FaPaintBrush />,
  "UX Designer": <FaUserCircle />
};

const MostDemandingCategories = () => {
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs/count-by-category")
      .then((response) => {
        const mappedData = response.data.map((item) => ({
          name: item._id,
          jobs: item.count,
          icon: icons[item._id] || <FaUserCircle />
        }));
        setCategoryData(mappedData);
      })
      .catch((error) => {
        console.error("Error fetching job counts", error);
      });
  }, []);

  return (
    <div className="most-demanding-container">
      <h2 className="section-title">Most Demanding Categories</h2>
      <div className="explore-all-container">
        <button className="explore-all-btn" onClick={() => navigate("/all-jobs")}>
          Explore All Jobs
        </button>
      </div>
      <div className="category-cards">
        {categoryData.map((category, index) => (
          <div className="category-card" key={index}>
            <div className="icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <p className="job-count">{category.jobs} Jobs Available</p>
            <button
              className="explore-btn"
              onClick={() =>
                navigate(`/jobs/${encodeURIComponent(category.name)}`)
              }
            >
              Explore
            </button>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default MostDemandingCategories;
