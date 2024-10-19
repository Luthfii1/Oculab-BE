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
  "/update-examination-result/:patientId/:examinationId",
  examinationControllers.updateExaminationResult
);
router.get(
  "/get-examination-by-id/:examinationId",
  examinationControllers.getExaminationById
);
router.get(
  "/get-number-of-examinations",
  examinationControllers.getNumberOfExaminations
);

module.exports = router;
