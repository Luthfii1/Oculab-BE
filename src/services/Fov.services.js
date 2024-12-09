const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

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
