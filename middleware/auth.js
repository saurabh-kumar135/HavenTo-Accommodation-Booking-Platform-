// Authentication middleware for API routes
const authMiddleware = (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Unauthorized. Please login to continue." 
    });
  }
};

module.exports = authMiddleware;
