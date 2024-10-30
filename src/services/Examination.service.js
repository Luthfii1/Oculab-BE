const { request } = require("express");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");
const { FOVData } = require("../models/Entity/FOVData.models");
const { User } = require("../models/Entity/User.models");
const { URL_EXTRACT_VIDEO, CHECK_VIDEO } = require("../config/constants");
const fs = require("fs");
const FormData = require("form-data");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

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

  const responseData = {
    ...examination.toObject(),
    FOV: [],
  };

  for (const fovId of examination.FOV) {
    const fov = await FOVData.findById(fovId);
    responseData.FOV.push(fov);
  }

  const PIC = await User.findById(examination.PIC);
  responseData.PIC = PIC;

  return {
    message: "Examination data received successfully",
    data: responseData,
  };
};

exports.getNumberOfExaminations = async function () {
  const totalNegative = await Examination.countDocuments({
    finalGrading: "NEGATIVE",
  });
  const totalPositive = await Examination.countDocuments({
    finalGrading: { $ne: "NEGATIVE" },
  });

  const numberOfExaminations = {
    numberOfPositive: totalPositive,
    numberOfNegative: totalNegative,
  };

  return {
    message: "Number of examinations received successfully",
    data: numberOfExaminations,
  };
};

exports.forwardVideoToML = async function (file, params) {
  const { patientId, examinationId } = params;

  if (!patientId) {
    throw new Error("Patient ID is required");
  }
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const videoFilePath = file.path;

  try {
    if (!fs.existsSync(videoFilePath)) {
      throw new Error("Video file is required");
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error("We can't find the patient");
    }

    const examination = await Examination.findById(examinationId);
    if (!examination) {
      throw new Error("We can't find the examination");
    }

    const url = URL_EXTRACT_VIDEO + "/" + patientId + "/" + examinationId;
    const formData = new FormData();
    formData.append("video", fs.createReadStream(videoFilePath), {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // You might consider using axios instead of fetch for better error handling
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(), // Necessary when using form-data package
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to forward video to ML service: ${errorText}`);
    }

    const result = await response.json();

    fs.unlink(videoFilePath, (err) => {
      if (err) {
        console.error(`Failed to remove temporary file: ${err}`);
      } else {
        console.log(`Temporary file ${videoFilePath} has been removed.`);
      }
    });

    return {
      message: "Video forwarded to ML service successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error occurred:", error);

    if (videoFilePath) {
      fs.unlink(videoFilePath, (err) => {
        if (err) {
          console.error("Failed to remove temporary file:", err);
        } else {
          console.log(
            `Temporary file ${videoFilePath} has been removed after error.`
          );
        }
      });
    }

    throw error;
  }
};

exports.getAllExaminations = async function () {
  const examinations = await Examination.find();

  var responseData = [];

  // find patient by examinationId
  for (const examination of examinations) {
    const patient = await Patient.findOne({
      resultExamination: { $in: [examination._id] },
    });

    responseData.push({
      examinationId: examination._id,
      slideId: examination.slideId,
      statusExamination: examination.statusExamination,
      patientId: patient._id,
      patientName: patient.name,
      patientDoB: patient.DoB,
    });
  }

  return {
    message: "Examination data received successfully",
    data: responseData,
  };
};
