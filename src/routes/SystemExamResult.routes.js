const Express = require("express");
const router = Express.Router();
const systemResultController = require("../controllers/SystemExamResult.controllers");

router.post(
  "/post-system-result/:examinationId",
  systemResultController.postSystemResult
);

module.exports = router;
