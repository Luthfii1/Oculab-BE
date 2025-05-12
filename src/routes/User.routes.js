const Express = require("express");
const router = Express.Router();
const userControllers = require("../controllers/User.controllers");
const roleType = require("../models/Enum/RolesType.enum");
const {
  authenticateToken,
  authenticateRefreshToken,
} = require("../middlewares/Authentication.middlewares");
const { authorizeRole } = require("../middlewares/Authorization.middlewares");

router.post("/login", userControllers.login);
router.post("/register", userControllers.register);
router.post(
  "/refresh-token/:userId",
  authenticateRefreshToken,
  userControllers.refreshToken
);
router.get(
  "/get-all-user-data",
  authorizeRole([roleType.RolesType.ADMIN]),
  userControllers.getAllUsers
);
router.get("/get-user-data-by-id/:userId", userControllers.getUserById);
router.get("/get-all-pics", userControllers.getAllPics);
router.put("/update-user/:userId", userControllers.updateUser);
router.put("/update-user-password/:userId", userControllers.updateUserPassword);
router.delete(
  "/delete-user/:userId",
  authorizeRole([roleType.RolesType.ADMIN]),
  userControllers.deleteUser
);

module.exports = router;
