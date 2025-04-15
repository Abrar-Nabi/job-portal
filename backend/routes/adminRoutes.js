// routes/employers.js
const express = require("express");
const Employer = require("../models/Employer");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ 1. View All Employers
 */
router.get("/all-employers", async (req, res) => {
  try {
    const employers = await Employer.find();
    res.json(employers);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching employers" });
  }
});

/**
 * ✅ 2. View Only Pending (Unapproved) Employers
 */
router.get("/pending-employers", async (req, res) => {
  try {
    const pending = await Employer.find({ isApproved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching pending employers" });
  }
});

/**
 * ✅ 3. Approve an Employer (No auth required here, add if needed)
 */
router.put("/approve-employer/:id", async (req, res) => {
  try {
    const updated = await Employer.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Employer not found" });
    res.json({ message: "Employer approved", employer: updated });
  } catch (err) {
    res.status(500).json({ message: "Error approving employer" });
  }
});

/**
 * 🛡️ 4. Edit Employer Details (Admin only)
 */
router.put("/edit-employer/:id", verifyToken, requireRole("admin"), async (req, res) => {
  const { companyName, email, location, industry } = req.body;
  try {
    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.params.id,
      { companyName, email, location, industry },
      { new: true }
    );
    if (!updatedEmployer) return res.status(404).json({ message: "Employer not found" });

    res.json({ message: "Employer updated", employer: updatedEmployer });
  } catch (err) {
    res.status(500).json({ message: "Error updating employer" });
  }
});

/**
 * 🛡️ 5. Delete Employer (Admin only)
 */
router.delete("/delete-employer/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json({ message: "Employer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employer" });
  }
});

module.exports = router;
