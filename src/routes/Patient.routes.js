const Express = require("express");
const router = Express.Router();
const patientControllers = require("../controllers/Patient.controllers");

router.post("/new-input-patient", patientControllers.newInputPatient);
router.get("/get-all-patients", patientControllers.getAllPatients);
router.get("/get-patient-by-id/:patientId", patientControllers.getPatientById);

module.exports = router;
