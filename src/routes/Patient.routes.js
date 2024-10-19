const Express = require("express");
const router = Express.Router();
const patientControllers = require("../controllers/Patient.controllers");

router.post("/create-new-patient", patientControllers.createNewPatient);
router.get("/get-all-patients", patientControllers.getAllPatients);
router.get("/get-patient-by-id/:patientId", patientControllers.getPatientById);

module.exports = router;
