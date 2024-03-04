const jwt = require("jsonwebtoken");

const ProtectedRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.authToken;

    // Check if the cookie doesn't have a token
    if (!token) {
      // Fallback to using token from localStorage if available
      token = localStorage.getItem("token");

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
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
