const { request } = require("express");
const { Examination } = require("../models/Examination.models");
const { Patient } = require("../models/Patient.models");
const { URL_EXPORT_VIDEO, CHECK_VIDEO } = require("../config/constants");
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

  const examinationResponse = examination.toObject();
  // Replace _id with examinationId
  examinationResponse.examinationId = examination._id;
  delete examinationResponse._id;
  delete examinationResponse.__v;

  // Add image preview from the first FOV image
  if (examinationResponse.fov.length > 0) {
    examinationResponse.imagePreview = examinationResponse.fov[0].image;

    // Replace _id with fovDataId in each FOV object
    for (const fov of examinationResponse.fov) {
      fov.fovDataId = fov._id;
      delete fov._id;
      delete fov.__v;
    }
  } else {
    examinationResponse.imagePreview =
      "https://static.vecteezy.com/system/resources/previews/004/968/590/non_2x/no-result-data-not-found-concept-illustration-flat-design-eps10-simple-and-modern-graphic-element-for-landing-page-empty-state-ui-infographic-etc-vector.jpg";
  }

  // Log the transformed examination object for debugging
  console.log(examinationResponse);

  return {
    message: "Examination data received successfully",
    data: examinationResponse,
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

// exports.forwardVideoToML = async function (file, params) {
//   const { examinationId } = params;

//   // Check if examinationId is provided
//   if (!examinationId) {
//     throw new Error("Examination ID is required");
//   }

//   const videoFilePath = file.path;

//   try {
//     // Check if the video file exists
//     if (!fs.existsSync(videoFilePath)) {
//       throw new Error("Video file is required");
//     }

//     // Check if examinationId exists
//     const examination = await Examination.findById(examinationId);
//     if (!examination) {
//       throw new Error("We can't find the examination");
//     }

//     const url = URL_EXPORT_VIDEO + "/" + examinationId;
//     const formData = new FormData();

//     // Append the video file with the correct key
//     formData.append("video", fs.createReadStream(videoFilePath), {
//       filename: file.originalname,
//       contentType: file.mimetype,
//     });

//     // Send the video to the machine learning service
//     const response = await fetch(url, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Error response body:", errorText);
//       throw new Error(`Failed to forward video to ML service: ${errorText}`);
//     }

//     const result = await response.json();

//     // Remove the temporary video file
//     fs.unlink(videoFilePath, (err) => {
//       if (err) {
//         console.error(`Failed to remove temporary file: ${err}`);
//       } else {
//         console.log(`Temporary file ${videoFilePath} has been removed.`);
//       }
//     });

//     return {
//       message: "Video forwarded to ML service successfully",
//       data: result,
//     };
//   } catch (error) {
//     console.error("Error occurred:", error);

//     // Attempt to remove the temporary file even if an error occurred
//     if (videoFilePath) {
//       fs.unlink(videoFilePath, (err) => {
//         if (err) {
//           console.error("Failed to remove temporary file:", err);
//         } else {
//           console.log(
//             `Temporary file ${videoFilePath} has been removed after error.`
//           );
//         }
//       });
//     }

//     throw error;
//   }
// };
