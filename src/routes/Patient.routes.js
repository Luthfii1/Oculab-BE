const Express = require("express");
const router = Express.Router();
const patientControllers = require("../controllers/Patient.controllers");

router.post("/create-new-patient", patientControllers.createNewPatient);
router.put("/update-data/:patientId", patientControllers.updatePatient);
router.get("/get-all-patients", patientControllers.getAllPatients);
router.get("/get-patient-by-id/:patientId", patientControllers.getPatientById);
router.get(
  "/get-all-patients-by-name/:patientName",
  patientControllers.getAllPatientsByName
);

module.exports = router;
