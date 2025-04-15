const express = require("express");
const router = express.Router();
const {
  registerJobSeeker,
  registerEmployer,
  loginUser,
} = require("../controllers/authController");

router.post("/register/seeker", registerJobSeeker);
router.post("/register/employer", registerEmployer);
router.post("/login", loginUser);

module.exports = router;
