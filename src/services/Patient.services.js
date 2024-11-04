const { Patient } = require("../models/Entity/Patient.models");
const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");

exports.createNewPatient = async function (body) {
  const { _id, name, NIK, DoB, sex, BPJS } = body;
  if (!name) {
    throw new Error("Name is required");
  }
  if (!NIK) {
    throw new Error("NIK is required");
  } else if (!/^\d{16}$/.test(NIK)) {
    throw new Error(
      "NIK must be a 16-digit number with no spaces or special characters"
    );
  }
  if (!DoB) {
    throw new Error("Date of Birth is required");
  }
  if (!sex) {
    throw new Error("Sex is required");
  }

  // Check if patient._id already exists
  const existingPatient = await Patient.findOne({ NIK: NIK });
  if (existingPatient) {
    throw new Error(`Patient with NIK ${NIK} already exists`);
  }

  const existingBPJS = await Patient.findOne({ BPJS: BPJS });
  if (existingBPJS) {
    throw new Error(`Patient with BPJS ${BPJS} already exists`);
  }

  let resultExamination = [];

  // Create new patient using the extracted fields
  const newPatient = new Patient({
    _id,
    name,
    NIK,
    DoB,
    sex,
    BPJS,
    resultExamination,
  });
  await newPatient.save();

  return {
    message: "Patient data received successfully",
    data: newPatient,
  };
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

  const existingPatient = await Patient.findById(patientId);
  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  // const patientWithoutResultExamination = patient.toObject();
  // delete patientWithoutResultExamination.resultExamination;

  // change the _id into patientId
  // patientWithoutResultExamination.patientId =
  //   patientWithoutResultExamination._id;
  // delete patientWithoutResultExamination._id;
  // delete patientWithoutResultExamination.__v;

  return {
    message: "Patient data received successfully",
    data: existingPatient,
  };
};

exports.getAllPatientsByName = async function (params) {
  const { patientName } = params;
  if (!patientName) {
    throw new Error("Patient name is required");
  }

  // make the search case insensitive
  const patients = await Patient.find({
    name: { $regex: new RegExp(patientName, "i") },
  });

  // Convert each patient document to a plain JavaScript object and modify it
  const patientsResponse = patients.map((patient) => {
    const patientObj = patient.toObject();

    // Replace the _id with patientId
    patientObj.patientId = patientObj._id;
    delete patientObj._id;
    delete patientObj.resultExamination;
    delete patientObj.__v;

    return patientObj;
  });

  return {
    message: "Patient data received successfully",
    data: patientsResponse,
  };
};
