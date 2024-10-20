const Express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage()});
const router = Express.Router();
const examinationControllers = require("../controllers/Examination.controllers");
const { uploadVideo } = require("../middlewares/Asset.middlewares");

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
router.post(
  "/forward-video-to-ml/:examinationId",
  uploadVideo.single("video"),
  examinationControllers.forwardVideoToML
);
router.post("/testing", examinationControllers.testing);

// router for get system diagnosis from examination id using video and send the video to other backend model server in URL/export-video/examinationId:
router.post(
  "/post-system-diagnosis/:examinationId",
  upload.single("video"),
  examinationControllers.postSystemDiagnosis
);

module.exports = router;
