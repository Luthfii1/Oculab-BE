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
  }
  if (NIK) {
    const existingNIK = await Patient.findOne({ NIK: NIK });
    if (existingNIK) {
      throw new Error("A patient with the provided NIK already exists");
    }

    if (!/^\d{16}$/.test(NIK)) {
      throw new Error("A valid NIK format is required");
    }
  }
  if (!DoB) {
    throw new Error("Date of Birth is required");
  }
  if (!sex) {
    throw new Error("Sex is required");
  }
  if (BPJS) {
    const existingBPJS = await Patient.findOne({ BPJS: BPJS });
    if (existingBPJS) {
      throw new Error("A patient with the provided BPJS already exists");
    }

    if (!/^\d{13}$/.test(BPJS)) {
      throw new Error("A valid BPJS format is required");
    }
  }

  // Check if patient._id already exists
  const existingId = await Patient.findById(_id);
  if (existingId) {
    throw new Error("A patient with the provided ID already exists");
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

exports.updatePatient = async function (body, params) {
  const { patientId } = params;
  if (!patientId || patientId === ":patientId") {
    throw new Error("Patient ID is required");
  }

  const existingPatient = await Patient.findById(patientId);
  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  const { name, NIK, DoB, sex, BPJS } = body;
  let changesDetected = false;

  if (name && name !== existingPatient.name) {
    existingPatient.name = name;
    changesDetected = true;
  }
  if (NIK && NIK !== existingPatient.NIK) {
    existingPatient.NIK = NIK;
    changesDetected = true;
  }
  if (
    DoB &&
    new Date(DoB).toISOString() !== existingPatient.DoB.toISOString()
  ) {
    existingPatient.DoB = DoB;
    changesDetected = true;
  }
  if (sex && sex !== existingPatient.sex) {
    existingPatient.sex = sex;
    changesDetected = true;
  }
  if (BPJS === "") {
    existingPatient.BPJS = undefined;
    changesDetected = true;
  } else if (BPJS) {
    if (!/^\d{13}$/.test(BPJS)) {
      throw new Error("A valid BPJS format is required");
    }
    if (BPJS !== existingPatient.BPJS) {
      existingPatient.BPJS = BPJS;
      changesDetected = true;
    }
  }

  if (!changesDetected) {
    return {
      message: "No changes detected in patient data",
      data: existingPatient,
    };
  }

  await existingPatient.save();

  return {
    message: "Patient data updated successfully",
    data: existingPatient,
  };
};

exports.getAllPatients = async function () {
  const patients = await Patient.find();

  const patientsResponse = patients.map((patient) => {
    const patientObj = patient.toObject();
    delete patientObj.__v;

    return patientObj;
  });

  return {
    message: "Patient data received successfully",
    data: patientsResponse,
  };
};

exports.getPatientById = async function (params) {
  const { patientId } = params;
  if (!patientId || patientId === ":patientId") {
    throw new Error("Patient ID is required");
  }

  const existingPatient = await Patient.findById(patientId);
  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  const patientWithoutResultExamination = existingPatient.toObject();
  delete patientWithoutResultExamination.resultExamination;

  return {
    message: "Patient data received successfully",
    data: patientWithoutResultExamination,
  };
};

exports.getAllPatientsByName = async function (params) {
  const { patientName } = params;
  if (!patientName || patientName === ":patientName") {
    throw new Error("Patient name is required");
  }

  // make the search case insensitive
  const patients = await Patient.find({
    name: { $regex: new RegExp(patientName, "i") },
  });

  // Convert each patient document to a plain JavaScript object and modify it
  const patientsResponse = patients.map((patient) => {
    const patientObj = patient.toObject();
    delete patientObj.__v;
    return patientObj;
  });

  // sort by the similarity of front name
  patientsResponse.sort((a, b) => {
    const aFrontName = a.name.split(" ")[0];
    const bFrontName = b.name.split(" ")[0];
    return aFrontName.localeCompare(bFrontName);
  });

  return {
    message: "Patient data received successfully",
    data: patientsResponse,
  };
};
