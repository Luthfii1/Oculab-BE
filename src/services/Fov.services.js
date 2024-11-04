const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

exports.postFOVData = async function (params, body) {
  const { examinationId } = params;
  if (!examinationId) {
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
  if (!confidenceLevel) {
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

  return {
    message: "FOVData received successfully",
    data: newFOVData,
  };
};
