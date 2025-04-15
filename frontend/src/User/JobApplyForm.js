import React, { useState } from "react";

const JobApplicationForm = ({ jobId }) => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);  // To show a loading state

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setForm({ ...form, resume: files[0] }); // Set resume file
    } else {
      setForm({ ...form, [name]: value }); // Set other field values
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Simple validation to check if all required fields are filled
    if (!form.email || !form.phone || !form.resume) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Show loading state
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("coverLetter", form.coverLetter);
    formData.append("resume", form.resume);
    formData.append("jobId", jobId); // Pass jobId in form data

    try {
      const res = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Application submitted successfully with resume!");
      setForm({
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
      }); // Reset form after successful submission
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false); // Hide loading state after submission attempt
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Apply for this Job</h2>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Resume:</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          required
        />
      </div>

   
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default JobApplicationForm;
