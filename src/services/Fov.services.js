const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");
const { Box } = require("../models/Entity/Box.models");

exports.postFOVData = async function (params, body) {
  const { examinationId } = params;
  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
  }

  const { _id, image, type, order, comment, systemCount, confidenceLevel } =
    body;
  if (!image) {
    throw new Error("Image is required");
  }
  if (!type) {
    throw new Error("Type is required");
  }
  if (!order) {
    throw new Error("Order is required");
  }
  if (systemCount === undefined) {
    throw new Error("System count is required");
  }
  if (confidenceLevel === undefined) {
    throw new Error("Confidence level is required");
  }

  const existingExamination = await Examination.findById(examinationId);
  if (!existingExamination) {
    throw new Error("Examination not found");
  }

  const patient = await Patient.findOne({
    resultExamination: existingExamination._id,
  });
  if (!patient) {
    throw new Error("Patient not found");
  }

  const existingFOVData = await FOVData.findById(_id);
  if (existingFOVData) {
    throw new Error("Duplicate ID");
  }

  const newFOVData = new FOVData({
    _id,
    image,
    type,
    order,
    comment,
    systemCount,
    confidenceLevel,
  });
  await newFOVData.save();

  existingExamination.FOV.push(newFOVData._id);
  await existingExamination.save();

  const FOVResponse = newFOVData.toObject();
  delete FOVResponse.__v;

  return FOVResponse;
};

exports.postFOVDataNew = async function (params, body) {
  const { examinationId } = params;
  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
  }

  const {
    _id,
    image,
    imageOriginal,
    imageMLAnalyzed,
    type,
    order,
    comment,
    systemCount,
    confidenceLevel,
    boxes,
    frameHeight = 600,
    frameWidth = 600,
  } = body;

  if (!image) throw new Error("Image is required");
  if (!type) throw new Error("Type is required");
  if (!order) throw new Error("Order is required");
  if (systemCount === undefined) throw new Error("System count is required");
  if (confidenceLevel === undefined)
    throw new Error("Confidence level is required");

  const existingExamination = await Examination.findById(examinationId);
  if (!existingExamination) throw new Error("Examination not found");

  const patient = await Patient.findOne({
    resultExamination: existingExamination._id,
  });
  if (!patient) throw new Error("Patient not found");

  if (_id) {
    const existingFOVData = await FOVData.findById(_id);
    if (existingFOVData) throw new Error("Duplicate ID");
  }

  let boxIds = [];

  if (boxes && Array.isArray(boxes) && boxes.length > 0) {
    try {
      const boxDocuments = boxes.map((box, index) => ({
        order: index + 1,
        xCoordinate: box.x,
        yCoordinate: box.y,
        width: box.width,
        height: box.height,
        status: "UNVERIFIED",
      }));

      const createdBoxes = await Promise.all(
        boxDocuments.map((boxData) => new Box(boxData).save())
      );

      boxIds = createdBoxes.map((box) => box._id);
    } catch (error) {
      throw new Error(`Failed to create bounding boxes: ${error.message}`);
    }
  }

  try {
    const fovDataObject = {
      ...(_id && { _id }),
      image,
      type,
      order,
      comment,
      systemCount,
      confidenceLevel,
      verified: false,
      ...(imageOriginal && { imageOriginal }),
      ...(imageMLAnalyzed && { imageMLAnalyzed }),
    };

    if (boxIds.length > 0) {
      fovDataObject.boundingBoxData = {
        boxes: boxIds,
        frameWidth,
        frameHeight,
      };
    }

    const newFOVData = await new FOVData(fovDataObject).save();

    await Examination.findByIdAndUpdate(examinationId, {
      $push: { FOV: newFOVData._id },
    });

    const responseData = newFOVData.toObject();
    delete responseData.__v;

    return {
      message: "FOV data with bounding boxes created successfully",
      data: responseData,
    };
  } catch (error) {
    if (boxIds.length > 0) {
      await Box.deleteMany({ _id: { $in: boxIds } }).catch((err) =>
        console.error("Failed to clean up orphaned boxes:", err)
      );
    }

    throw new Error(`Failed to create FOV data: ${error.message}`);
  }
};

exports.getAllFOVByExaminationId = async function (params) {
  const { examinationId } = params;
  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
  }

  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }

  if (examination.FOV.length === 0) {
    return {};
  }

  const allFovsId = examination.FOV;
  const fovBta0 = [];
  const fovBta1to9 = [];
  const fovBtaAbove9 = [];

  for (const fovId of allFovsId) {
    const fov = await FOVData.findById(fovId);
    const fovResponse = fov.toObject();
    delete fovResponse.__v;

    if (fovResponse.systemCount === 0) {
      fovBta0.push(fovResponse);
    } else if (fovResponse.systemCount >= 1 && fovResponse.systemCount <= 9) {
      fovBta1to9.push(fovResponse);
    } else {
      fovBtaAbove9.push(fovResponse);
    }
  }

  const responseData = {
    BTA0: fovBta0,
    BTA1TO9: fovBta1to9,
    BTAABOVE9: fovBtaAbove9,
  };

  return responseData;
};

exports.updateVerifiedField = async function (params, body) {
  const { fovId } = params;
  if (!fovId || fovId === ":fovId") {
    throw new Error("FOV ID is required");
  }

  const fov = await FOVData.findById(fovId);
  if (!fov) {
    throw new Error("FOV not found");
  }

  fov.verified = true;
  await fov.save();

  return fov;
};
