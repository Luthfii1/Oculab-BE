const { ExpertExamResult } = require("../models/Entity/ExpertExamResult.model");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");

exports.postExpertResult = async function (body, params) {
  const { examinationId } = params;
  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
  }

  const { _id, finalGrading, bacteriaTotalCount } = body;
  let { notes } = body;
  if (!finalGrading) {
    throw new Error("Final grading is required");
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

  const existingExpertResult = await ExpertExamResult.findById(_id);
  if (existingExpertResult) {
    throw new Error("Duplicate ID");
  }

  const newExpertResultData = new ExpertExamResult({
    _id,
    finalGrading,
    bacteriaTotalCount,
    notes,
  });
  await newExpertResultData.save();

  // update examinationDate to current date
  existingExamination.examinationDate = new Date();
  await existingExamination.save();

  // update patient status to "FINISHED"
  existingExamination.expertResult = newExpertResultData._id;
  existingExamination.statusExamination = "FINISHED";
  await existingExamination.save();

  const expertResultResponse = newExpertResultData.toObject();
  delete expertResultResponse.__v;

  return expertResultResponse;
};
