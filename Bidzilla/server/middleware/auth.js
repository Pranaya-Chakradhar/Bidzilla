import jwt from "jsonwebtoken";

// Middleware factory to check JWT auth and allowed roles
export default function authMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // Get Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "Authorization header missing" });

      // Extract token: "Bearer <token>"
      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token missing" });

      // Verify token using secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info from token to request object
      req.user = decoded;

      // Check if user's role is allowed (if allowedRoles specified)
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient rights" });
      }

      // If all good, proceed to next middleware/route handler
      next();
    } catch (err) {
      // On any error, return 401 Unauthorized with message
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
