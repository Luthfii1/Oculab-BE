const { SystemExamResult } = require("../models/Entity/SystemExamResult.model");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

exports.postSystemResult = async function (body, params) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
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

  const { systemResult } = body;
  if (!systemResult) {
    throw new Error("System Result Data is required");
  }

  const newSystemResultData = new SystemExamResult(systemResult);
  await newSystemResultData.save();

  existingExamination.systemResult = newSystemResultData._id;
  await existingExamination.save();

  return {
    message: "System result received successfully",
    data: newSystemResultData,
  };
};
