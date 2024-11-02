const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

exports.postFOVData = async function (params, body) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const { fovData } = body;
  if (!fovData) {
    throw new Error("FOVData is required");
  }

  const existingExamination = await Examination.findById(examinationId);
  if (!existingExamination) {
    throw new Error("Examination not found");
  }

  const patient = await Patient.findOne({
    examination: existingExamination._id,
  });
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newFOVData = new FOVData(fovData);
  await newFOVData.save();

  existingExamination.FOV.push(newFOVData._id);
  await existingExamination.save();

  return {
    message: "FOVData received successfully",
    data: newFOVData,
  };
};
