const mongoose = require("mongoose");
const { Patient } = require("../models/Entity/Patient.models");
const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");

exports.createNewPatient = async function (body) {
  const { _id, name, NIK, DoB, sex, resultExamination, BPJS } = body;
  if (!_id) {
    throw new Error("Id Patient is required");
  }
  if (!name) {
    throw new Error("Name is required");
  }
  if (!NIK) {
    throw new Error("NIK is required");
  }
  if (!DoB) {
    throw new Error("Date of Birth is required");
  }
  if (!sex) {
    throw new Error("Sex is required");
  }

  // Check if patient._id already exists
  const existingPatient = await Patient.findById(_id);
  if (existingPatient) {
    throw new Error("Patient already exists");
  }

  const session = await mongoose.startSession(); // Start the session
  session.startTransaction(); // Begin transaction

  try {
    let savedExaminations = [];
    let savedFOVs = [];

    if (resultExamination) {
      for (const examination of resultExamination) {
        if (!examination._id) {
          throw new Error("Examination _id is required");
        }

        const existingExamination = await Examination.findById(
          examination._id
        ).session(session);
        if (existingExamination) {
          throw new Error("Examination already exists");
        }

        let fovForCurrentExam = [];

        if (Array.isArray(examination.fov)) {
          for (const fov of examination.fov) {
            if (!fov._id) {
              throw new Error("FOVData _id is required");
            }

            const existingFOV = await FOVData.findById(fov._id).session(
              session
            );
            if (existingFOV) {
              throw new Error("FOVData already exists");
            }

            const newFOVData = new FOVData(fov);
            fovForCurrentExam.push(newFOVData);
            savedFOVs.push(newFOVData);
          }
        } else {
          throw new Error("FOVData must be an array");
        }

        examination.fov = fovForCurrentExam;

        const newExamination = new Examination(examination);
        savedExaminations.push(newExamination);
      }
    }

    // Create new patient using the extracted fields
    const newPatient = new Patient({ _id, name, NIK, DoB, sex, BPJS });
    await newPatient.save({ session });

    // Remove __v field from saved patient
    const responsePatient = newPatient.toObject();
    delete responsePatient.__v;

    for (const exam of savedExaminations) {
      await exam.save({ session });
    }

    for (const fov of savedFOVs) {
      await fov.save({ session });
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: "Patient data received successfully",
      data: responsePatient,
    };
  } catch (error) {
    // Abort transaction if something goes wrong
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

  const patientWithoutResultExamination = patient.toObject();
  delete patientWithoutResultExamination.resultExamination;

  // change the _id into patientId
  patientWithoutResultExamination.patientId =
    patientWithoutResultExamination._id;
  delete patientWithoutResultExamination._id;
  delete patientWithoutResultExamination.__v;

  return {
    message: "Patient data received successfully",
    data: patientWithoutResultExamination,
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
