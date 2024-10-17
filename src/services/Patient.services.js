const { Patient } = require("../models/Patient.models");

exports.newInputPatient = async function (body) {
  const { patient } = body;
  if (!patient) {
    throw new Error("Patient data is required");
  }

  const newPatient = new Patient(patient);
  await newPatient.save();

  return { message: "Patient data received successfully", data: newPatient };
};

exports.getAllPatients = async function () {
  console.log("getAllPatients");

  // get all patients from db
  const patients = await Patient.find();
  print("patients", patients);

  return { message: "Patient data received successfully", data: patients };
};

exports.getPatientById = async function (params) {
  const { patientId } = params;
  if (!patientId) {
    throw new Error("Patient ID is required");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};
