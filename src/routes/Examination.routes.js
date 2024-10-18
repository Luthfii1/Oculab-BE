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

module.exports = router;
