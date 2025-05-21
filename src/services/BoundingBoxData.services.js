const { FOVData } = require("../models/Entity/FOVData.models");
const { Box } = require("../models/Entity/Box.models");
const { StatusBoxType } = require("../models/Enum/StatusBoxType.enum");

exports.getBoundingBoxesByFovId = async function (params) {
  const { fovId } = params;
  if (!fovId || fovId === ":fovId") {
    throw new Error("FOV ID is required");
  }

  const fov = await FOVData.findById(fovId);
  if (!fov) {
    throw new Error("FOV not found");
  }

  if (!fov.boundingBoxes) {
    throw new Error("No bounding box data available yet for this FOV");
  }

  let boxesData = [];
  if (fov.boundingBoxes.boxes && fov.boundingBoxes.boxes.length > 0) {
    boxesData = await Box.find({
      _id: { $in: fov.boundingBoxes.boxes },
    }).sort({ order: 1 });
  }

  return {
    message: "Bounding box data retrieved successfully",
    data: {
      frameWidth: fov.boundingBoxes.frameWidth,
      frameHeight: fov.boundingBoxes.frameHeight,
      boxes: boxesData,
    },
  };
};
exports.updateBoxStatusByBoxId = async function (params, body) {
  const { boxId } = params;
  if (!boxId || boxId === ":boxId") {
    throw new Error("Bounding Box ID is required");
  }
  const { boxStatus } = body;
  if (!boxStatus) {
    throw new Error("Box status is required in request body");
  }

  const validStatusBoxType = Object.values(StatusBoxType);
  if (!validStatusBoxType.includes(boxStatus)) {
    throw new Error(
      `Invalid box status. Must be either ${validStatusBoxType.join(", ")}`
    );
  }

  const box = await Box.findById(boxId);
  if (!box) {
    throw new Error("Box not found");
  }

  box.status = boxStatus;
  await box.save();

  return {
    message: "Box status updated successfully",
    data: box,
  };
};
