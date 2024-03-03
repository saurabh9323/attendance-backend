// module.exports = ProtectedRoute;
const jwt = require("jsonwebtoken");

const ProtectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Store the decoded user information in the request object
    next(); // Call the next middleware function
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = ProtectedRoute;
