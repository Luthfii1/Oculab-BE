const { ExpertExamResult } = require("../models/Entity/ExpertExamResult.model");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

exports.postExpertResult = async function (body, params) {
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

  const { expertResult } = body;
  if (!expertResult) {
    throw new Error("Expert Result Data is required");
  }

  const newExpertResultData = new ExpertExamResult(expertResult);
  await newExpertResultData.save();

  existingExamination.expertResult = newExpertResultData._id;
  await existingExamination.save();

  return {
    message: "Expert result received successfully",
    data: newExpertResultData,
  };
};
