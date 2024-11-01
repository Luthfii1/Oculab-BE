const roles = require("../models/Enum/RolesType.enum");

const authorizeRole = (requiredRoles) => {
    return (req, res, next) => {

        if (!req.body.tokenUserId || !req.body.tokenRole) {
            return res.status(401).json({ message: 'Unauthorized access, no role found' });
        }
        
        const userRole = req.body.tokenRole; 
        if (requiredRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    };
  };

//   const authenticationHeader = req.headers['authorization'];
//     const token = authenticationHeader && authenticationHeader.split(' ')[1];

//     if (!token) return res.status(401).json({ message: 'No token provided' });

//     jwt.verify(token, accessToken, (err, decoded) => {
//         if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

//         req.body.tokenUserId = decoded.userId;
//         req.body.tokenRole = decoded.role;
//         next();
//     });
  
  module.exports = {
    authorizeRole
  };