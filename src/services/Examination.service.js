const { request } = require("express");
const { Examination } = require("../models/Examination.models");
const { Patient } = require("../models/Patient.models");
const { URL_EXPORT_VIDEO } = require("../../constants");

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
  // get totalnegative by count all examination with finalGrading == enum negative of GradingType
  const totalNegative = await Examination.countDocuments({
    finalGrading: "NEGATIVE",
  });

  // get totalpositive by count all examination with finalGrading == except enum negative of GradingType
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

// service for post system diagnosis from examination id using video in multipart form request with body of video and send the video to other backend model server in URL/export-video/examinationId:
exports.postSystemDiagnosis = async function (params, body) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }

  // send the video to other backend model server in URL/export-video/examinationId
  // and get the system diagnosis result

  const sendVideoToOtherModelServer = async function (examinationId, video) { 
    // send the video to other backend model server in URL/export-video/examinationId
    // and get the system diagnosis result
    // return the result of system diagnosis
    request.post(
      {
        url: `URL_EXPORT_VIDEO/${examinationId}`,
        formData: {
          video: {
            value: video,
          },
        },
      },
      function (error, response, body) {
        if (error) {
          throw new Error("Failed to send video to other model server");
        }

        return body;
      }
    )
    return {
      message: "System diagnosis received successfully",
      data: systemDiagnosisResult,
    };
  }

  const systemDiagnosisResult = await sendVideoToOtherModelServer(
    examinationId,
    body.video
  );

  

  // return the result of system diagnosis
  return {
    message: "System diagnosis received successfully",
    data: systemDiagnosisResult,
  };
}