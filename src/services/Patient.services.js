const mongoose = require("mongoose");
const { Patient } = require("../models/Patient.models");
const { FOVData } = require("../models/FOVData.models");
const { Examination } = require("../models/Examination.models");

exports.newInputPatient = async function (body) {
  const { patient } = body;
  if (!patient) {
    throw new Error("Patient data is required");
  }

  // Check if patient._id already exists
  const existingPatient = await Patient.findById(patient._id);
  if (existingPatient) {
    throw new Error("Patient already exists");
  }

  const session = await mongoose.startSession(); // Start the session
  session.startTransaction(); // Begin transaction

  try {
    let savedExaminations = [];
    let savedFOVs = []; 

    if (patient.resultExamination) {
      for (const examination of patient.resultExamination) {
        if (!examination._id) {
          throw new Error("Examination _id is required");
        }

        const existingExamination = await Examination.findById(
          examination._id
        ).session(session);
        if (existingExamination) {
          throw new Error("Examination already exists");
        }

        // Reset savedFOVs for each examination to avoid duplication
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

    // Save patient, examinations, and FOV data using the session
    const newPatient = new Patient(patient);
    await newPatient.save({ session });

    for (const exam of savedExaminations) {
      await exam.save({ session });
    }

    for (const fov of savedFOVs) {
      await fov.save({ session });
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "Patient data received successfully", data: newPatient };
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

  return patient;
};
