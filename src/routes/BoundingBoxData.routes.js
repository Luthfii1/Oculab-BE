const Express = require("express");
const router = Express.Router();
const boundingBoxControllers = require("../controllers/BoundingBoxData.controllers");

router.get(
  "/get-bounding-box-data/:fovId",
  boundingBoxControllers.getBoundingBoxesByFovId
);
router.put(
  "/update-box-status/:boxId",
  boundingBoxControllers.updateBoxStatusByBoxId
);

module.exports = router;
