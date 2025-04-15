import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import manImage from "../assets/banner-right-image.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MostDemandingCategories from "../User/MostDemandingCategories";
import RecentJobListing from "../User/RecentJobListing";
import Footer from "./Footer";

const HomePage = () => {
  const navigate = useNavigate();

  const [companyNames, setCompanyNames] = useState([]);
  const [locations, setLocations] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    location: "",
    experienceLevel: "",
    employmentType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim()) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:5000/api/jobs/search?${params.toString()}`);
      navigate("/search-results", { state: { results: response.data } }); // ⬅️ Redirect to search results page
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/filters");
        const { companyNames, locations, experienceLevels, employmentTypes } = response.data;

        setCompanyNames(companyNames);
        setLocations(locations);
        setExperienceLevels(experienceLevels);
        setEmploymentTypes(employmentTypes);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilters();
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="left-section">
          <div className="overlay">
            <p className="subheading">We deliver blazing fast work solutions</p>
            <h1 className="main-heading">Find & Hire Top 3% of Experts on HireNest</h1>

            <form className="search-form" onSubmit={handleSearch}>
              <select className="input-field" name="companyName" value={formData.companyName} onChange={handleChange}>
                <option value="">Select Company</option>
                {companyNames.map((company) => (
                  <option key={company._id} value={company.companyName}>{company.companyName}</option>
                ))}
              </select>

              <select className="input-field" name="location" value={formData.location} onChange={handleChange}>
                <option value="">Select Location</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>

              <select className="input-field" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="">Select Experience Level</option>
                {experienceLevels.map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>

              <select className="input-field" name="employmentType" value={formData.employmentType} onChange={handleChange}>
                <option value="">Select Employment Type</option>
                {employmentTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>

              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
        </div>

        <div className="right-section">
          <img src={manImage} alt="Expert" className="man-image" />
        </div>
      </div>

      <MostDemandingCategories />
      <RecentJobListing />
      <Footer/>
    </>
  );
};

export default HomePage;
