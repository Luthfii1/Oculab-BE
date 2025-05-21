const Express = require("express");
const router = Express.Router();
const fovControllers = require("../controllers/Fov.controllers");

router.post("/post-fov-data/:examinationId", fovControllers.postFOVData);
router.post("/post-fov-data/v2/:examinationId", fovControllers.postFOVDataNew);
router.get(
  "/get-all-fov-by-examination-id/:examinationId",
  fovControllers.getAllFOVByExaminationId
);
// update the verified field to true
router.put("/update-verified-field/:fovId", fovControllers.updateVerifiedField);

module.exports = router;
