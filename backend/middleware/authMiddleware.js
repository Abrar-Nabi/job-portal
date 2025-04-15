const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret"; // Replace with env in production

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // e.g., { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};


const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: "Access denied: Insufficient permissions" });
  }
  next();
};

module.exports = { verifyToken, requireRole };
