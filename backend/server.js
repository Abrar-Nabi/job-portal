const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Set up CORS with specific origin and credentials allowed
app.use(cors({
  origin: 'http://localhost:3000', // Replace this with your frontend URL (e.g., 'https://yourfrontend.com')
  credentials: true,  // Allow cookies to be sent with requests
}));

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/job-portal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/employer", require("./routes/employerRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/jobseeker", require("./routes/SeekersRoutes"));
app.use("/api", require("./routes/filters"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/employer', require('./routes/dashboard'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
