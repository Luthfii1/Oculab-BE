const Express = require("express");
const router = Express.Router();
const expertResultController = require("../controllers/ExpertExamResult.controllers");

router.post(
  "/post-expert-result/:examinationId",
  expertResultController.postExpertResult
);

module.exports = router;
