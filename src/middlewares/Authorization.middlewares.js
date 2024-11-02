const roles = require("../models/Enum/RolesType.enum");

const authorizeRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.body.tokenUserId || !req.body.tokenRole) {
      return res
        .status(401)
        .json({ message: "Unauthorized access, no role found" });
    }

    const userRole = req.body.tokenRole;
    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  };
};

module.exports = {
  authorizeRole,
};
