const Express = require("express");
const router = Express.Router();
const examinationControllers = require("../controllers/Examination.controllers");

router.post(
  "/create-examination/:patientId",
  examinationControllers.createExamination
);
router.get(
  "/get-examinations-by-user/:patientId",
  examinationControllers.getExaminationsByUser
);
router.post(
  "/post-final-ml-analyze/:patientId/:examinationId",
  examinationControllers.postFinalMLAnalyze
);
router.get(
  "/get-examination-by-id/:examinationId",
  examinationControllers.getExaminationById
);

module.exports = router;
