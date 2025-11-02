// Middleware to check if user has required role
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of these roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};
