const Express = require("express");
const router = Express.Router();
const examinationControllers = require("../controllers/Examination.controllers");

router.post("/new-input-examination", examinationControllers.newInputExamination);
router.get("/get-examinations-by-user/:patientId", examinationControllers.getExaminationsByUser);

module.exports = router;
