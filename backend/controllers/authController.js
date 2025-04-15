const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "your_jwt_secret"; // Use env in production

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
};

exports.registerJobSeeker = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await JobSeeker.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await JobSeeker.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Job seeker registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.registerEmployer = async (req, res) => {
  const { companyName, email, password, location } = req.body;

  try {
    const existingUser = await Employer.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = await Employer.create({
      companyName,
      email,
      password: hashedPassword,
      location,
      isApproved: false, // pending admin approval
    });

    res.status(201).json({ message: "Employer registered. Awaiting approval." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check in Admins
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = generateToken(admin._id, "admin");
      return res.json({ token, role: "admin",
        name:admin.name
       });
    }

    // Check in Employers
    const employer = await Employer.findOne({ email });
    if (employer) {
      if (!employer.isApproved) return res.status(403).json({ message: "Employer not approved yet." });
      if (await bcrypt.compare(password, employer.password)) {
        const token = generateToken(employer._id, "employer");
        return res.json({
          token,
          role: "employer",
          name: employer.companyName,
        });
      }
    }

    // Check in Job Seekers
    const seeker = await JobSeeker.findOne({ email });
    if (seeker && (await bcrypt.compare(password, seeker.password))) {
      const token = generateToken(seeker._id, "seeker");
      return res.json({
        token,
        role: "seeker",
        name: seeker.name,
        email: seeker.email || "",
      });
    }

    res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);  // Keep this for debugging actual errors
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
