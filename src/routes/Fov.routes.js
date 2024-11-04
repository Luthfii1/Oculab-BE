const Express = require("express");
const router = Express.Router();
const fovControllers = require("../controllers/Fov.controllers");

router.post("/post-fov-data/:examinationId", fovControllers.postFOVData);
router.get("/get-all-fov-by-examination-id/:examinationId", fovControllers.getAllFOVByExaminationId);

module.exports = router;
