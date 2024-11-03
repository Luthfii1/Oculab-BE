const Express = require("express");
const router = Express.Router();
const userControllers = require("../controllers/User.controllers");
const roleType = require("../models/Enum/RolesType.enum");
const { authenticateToken, authenticateRefreshToken } = require("../middlewares/Authentication.middlewares");
const { authorizeRole } = require("../middlewares/Authorization.middlewares");

router.post("/login", userControllers.login);
router.post("/register", userControllers.register);
router.post("/refresh-token/:userId", authenticateRefreshToken, userControllers.refreshToken); 

router.get("/get-all-user-data", authenticateToken, authorizeRole([roleType.RolesType.ADMIN, roleType.RolesType.LAB]), userControllers.getAllUsers);
router.get("/get-user-data-by-id/:userId", authenticateToken, authorizeRole([roleType.RolesType.ADMIN]), userControllers.getUserById);

module.exports = router;