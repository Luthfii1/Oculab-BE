const Express = require("express");
const router = Express.Router();
const userControllers = require("../controllers/User.controllers");
const { authenticateToken, authenticateRefreshToken } = require("../middlewares/Authentication.middlewares");
// const { authenticateToken, generateAccessToken, generateRefreshToken } = require("../middlewares/Authentication.middlewares");

router.post("/login", userControllers.login);
router.post("/refresh-token/:userId", authenticateRefreshToken, userControllers.refreshToken); 

// router.get("/get-access-token-by-id/:userId", userControllers.getToken);
router.get("/get-all-user-data", authenticateToken, userControllers.getAllUsers);
router.get("/get-user-data-by-id/:userId", authenticateToken, userControllers.getUserById);

// router.delete("/logout/:userId", authenticateToken, deleteToken, userControllers.logout);

module.exports = router;