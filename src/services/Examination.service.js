const { Examination } = require("../models/Examination.models");
const { Patient } = require("../models/Patient.models");

exports.createExamination = async function (params, body) {
  const patientId = params.patientId;
  if (!patientId) {
    throw new Error("Patient ID is required");
  }

  const { examination } = body;
  if (!examination) {
    throw new Error("Examination data is required");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newExamination = new Examination(examination);
  await newExamination.save();
  patient.resultExamination.push(newExamination);
  await patient.save();

  return {
    message: "Examination data received successfully",
    data: newExamination,
  };
};

exports.getExaminationsByUser = async function (params) {
  const { patientId } = params;
  if (!patientId) {
    throw new Error("Patient ID is required");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  return {
    message: "Examination data received successfully",
    data: patient.resultExamination,
  };
};

exports.updateExaminationResult = async function (params, body) {
  const { patientId, examinationId } = params;
  if (!examinationId || !patientId) {
    throw new Error("Patient ID or Examination ID are required");
  }

  const { examination } = body;
  if (!examination) {
    throw new Error("Examination data is required");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const examinationToUpdate = await Examination.findById(examinationId);
  if (!examinationToUpdate) {
    throw new Error("Examination not found");
  }

  // update the examination data with the updated data
  for (const [key, value] of Object.entries(examination)) {
    examinationToUpdate[key] = value;
  }

  await examinationToUpdate.save();

  // update the patient data with the updated examination data by examinationId and patientId
  await Patient.updateOne(
    { _id: patientId, "resultExamination._id": examinationId },
    {
      $set: {
        "resultExamination.$": examinationToUpdate,
      },
    }
  );

  return {
    message: "Successfully to updated the examination data",
    data: patient.resultExamination,
  };
};

exports.getExaminationById = async function (params) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }

  return {
    message: "Examination data received successfully",
    data: examination,
  };
};
