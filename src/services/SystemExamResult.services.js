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
    resultExamination: existingExamination._id,
  });
  if (!patient) {
    throw new Error("Patient not found");
  }

  const {
    _id,
    systemGrading,
    confidenceLevelAggregated,
    systemBacteriaTotalCount,
  } = body;
  if (!systemGrading) {
    throw new Error("System grading is required");
  }
  if (!confidenceLevelAggregated) {
    throw new Error("Confidence level (aggregated) is required");
  }
  if (!systemBacteriaTotalCount) {
    throw new Error("System bacteria total count is required");
  }

  const newSystemResultData = new SystemExamResult({
    _id,
    systemGrading,
    confidenceLevelAggregated,
    systemBacteriaTotalCount,
  });
  await newSystemResultData.save();

  existingExamination.systemResult = newSystemResultData._id;
  existingExamination.statusExamination = "NEEDVALIDATION";
  await existingExamination.save();

  const systemResultResponse = newSystemResultData.toObject();
  delete systemResultResponse.__v;

  return systemResultResponse;
};
