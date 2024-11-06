const { ExpertExamResult } = require("../models/Entity/ExpertExamResult.model");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

exports.postExpertResult = async function (body, params) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const { _id, finalGrading, bacteriaTotalCount, notes } = body;
  if (!finalGrading) {
    throw new Error("Final grading is required");
  }
  if (!bacteriaTotalCount === undefined) {
    throw new Error("Bacteria total count is required");
  }
  if (!notes) {
    throw new Error("Notes is required");
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

  const newExpertResultData = new ExpertExamResult({
    _id,
    finalGrading,
    bacteriaTotalCount,
    notes,
  });
  await newExpertResultData.save();

  existingExamination.expertResult = newExpertResultData._id;
  existingExamination.statusExamination = "FINISHED";
  await existingExamination.save();

  const expertResultResponse = newExpertResultData.toObject();
  delete expertResultResponse.__v;

  return {
    message: "Expert result received successfully",
    data: expertResultResponse,
  };
};
