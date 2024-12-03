const { request } = require("express");
const { Examination } = require("../models/Entity/Examination.models");
const { ExpertExamResult } = require("../models/Entity/ExpertExamResult.model");
const { Patient } = require("../models/Entity/Patient.models");
const { FOVData } = require("../models/Entity/FOVData.models");
const { User } = require("../models/Entity/User.models");
const { URL_EXTRACT_VIDEO, CHECK_VIDEO } = require("../config/constants");
const fs = require("fs");
const FormData = require("form-data");
const dotenv = require("dotenv");
const { SystemExamResult } = require("../models/Entity/SystemExamResult.model");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

exports.createExamination = async function (params, body) {
  const patientId = params.patientId;
  if (!patientId || patientId === ":patientId") {
    throw new Error("Patient ID is required");
  }

  const {
    _id,
    goal,
    preparationType,
    slideId,
    examinationDate,
    statusExamination,
    PIC,
    DPJP,
    examinationPlanDate,
  } = body;

  if (!goal) {
    throw new Error("Examination goal type is required");
  }
  if (!preparationType) {
    throw new Error("Examination preparation type is required");
  }
  if (!slideId) {
    throw new Error("Slide ID is required");
  }
  if (!examinationDate) {
    throw new Error("Examination date is required");
  }
  if (!PIC) {
    throw new Error("PIC ID is required");
  }
  if (!DPJP) {
    throw new Error("DPJP ID is required");
  }
  if (!examinationPlanDate) {
    throw new Error("Examination plan date is required");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const existingExamination = await Examination.findById(_id);
  if (existingExamination) {
    throw new Error("Examination ID already exists");
  }

  const existingSlideId = await Examination.findOne({ slideId: slideId });
  if (existingSlideId) {
    throw new Error("A patient with the provided slide ID already exists");
  }

  const existingLAB = await User.findOne({ _id: PIC });
  if (!existingLAB) {
    throw new Error(
      "No matching PIC or Lab Technician found for the provided ID"
    );
  }

  const existingDPJP = await User.findOne({ _id: DPJP });
  if (!existingDPJP) {
    throw new Error("No matching DPJP or Admin found for the provided ID");
  }

  let FOV = [];
  let systemResult, expertResult;
  const newExamination = new Examination({
    _id,
    goal,
    preparationType,
    slideId,
    examinationDate,
    statusExamination,
    FOV,
    systemResult,
    expertResult,
    PIC,
    examinationPlanDate,
    DPJP,
  });
  await newExamination.save();

  patient.resultExamination.push(newExamination._id);
  await patient.save();

  const responseData = newExamination.toObject();
  delete responseData.__v;
  delete responseData.FOV;
  delete responseData.imagePreview;

  return {
    message: "Examination data received successfully",
    data: responseData,
  };
};

exports.getExaminationsByUser = async function (params) {
  const { patientId } = params;
  if (!patientId || patientId === ":patientId") {
    throw new Error("Patient ID is required");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  return {
    message: "Examination data received successfully",
    data: resultExamination,
  };
};

exports.updateExaminationResult = async function (params, body) {
  const { patientId, examinationId } = params;
  if (!patientId || patientId === ":patientId") {
    throw new Error("Patient ID is required");
  }
  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
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
    data: resultExamination,
  };
};

exports.getExaminationById = async function (params) {
  const { examinationId } = params;
  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
  }

  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }

  const responseData = {
    ...examination.toObject(),
  };

  const PIC = await User.findById(examination.PIC);
  const PICResponse = PIC.toObject();
  delete PICResponse.__v;
  delete PICResponse.password;
  delete PICResponse.accessPin;
  responseData.PIC = PICResponse;

  const DPJP = await User.findById(examination.DPJP);
  const DPJPResponse = DPJP.toObject();
  delete DPJPResponse.__v;
  delete DPJPResponse.password;
  delete DPJPResponse.accessPin;
  responseData.DPJP = DPJPResponse;

  if (examination.systemResult) {
    const systemResult = await SystemExamResult.findById(
      examination.systemResult
    );
    const systemResultResponse = systemResult.toObject();
    delete systemResultResponse.__v;

    responseData.systemResult = systemResultResponse;
  }

  if (examination.expertResult) {
    const expertResult = await ExpertExamResult.findById(
      examination.expertResult
    );
    const expertResultResponse = expertResult.toObject();
    delete expertResultResponse.__v;

    responseData.expertResult = expertResultResponse;
  }

  delete responseData.__v;
  delete responseData.FOV;

  return {
    message: "Examination data received successfully",
    data: responseData,
  };
};

exports.getNumberOfExaminations = async function () {
  const allExpertExamResults = await ExpertExamResult.find();

  const totalNegative = allExpertExamResults.filter(
    (result) => result.finalGrading === "NEGATIVE"
  ).length;

  const totalScanty = allExpertExamResults.filter(
    (result) => result.finalGrading === "SCANTY"
  ).length;

  const totalPositive1 = allExpertExamResults.filter(
    (result) => result.finalGrading === "Positive 1+"
  ).length;

  const totalPositive2 = allExpertExamResults.filter(
    (result) => result.finalGrading === "Positive 2+"
  ).length;

  const totalPositive3 = allExpertExamResults.filter(
    (result) => result.finalGrading === "Positive 3+"
  ).length;

  const numberOfExaminations = {
    negative: totalNegative,
    scanty: totalScanty,
    positive1: totalPositive1,
    positive2: totalPositive2,
    positive3: totalPositive3,
  };

  return {
    message: "Number of examinations received successfully",
    data: numberOfExaminations,
  };
};

exports.forwardVideoToML = async function (file, params) {
  const { examinationId } = params;

  if (!examinationId || examinationId === ":examinationId") {
    throw new Error("Examination ID is required");
  }

  const videoFilePath = file.path;

  try {
    if (!fs.existsSync(videoFilePath)) {
      throw new Error("Video file is required");
    }

    const examination = await Examination.findById(examinationId);
    if (!examination) {
      throw new Error("Examination not found");
    }

    const url = URL_EXTRACT_VIDEO + "/" + examinationId;
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
      throw new Error({
        message: "Failed to forward video to ML service",
        description: `${errorText}.`,
      });
    }

    examination.statusExamination = "INPROGRESS";
    await examination.save();

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
      data: {
        statusML: result,
      },
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

    throw new Error({ message: "Failed to remove video", description: error });
  }
};

exports.getAllExaminations = async function (params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const examinations = await Examination.find({ PIC: userId });
  var responseData = [];

  // find patient by examinationId
  for (const examination of examinations) {
    const patient = await Patient.findOne({
      resultExamination: { $in: [examination._id] },
    });

    const pic = await User.findById(examination.PIC);

    if (patient && pic) {
      responseData.push({
        examinationId: examination._id,
        slideId: examination.slideId,
        statusExamination: examination.statusExamination,
        patientId: patient._id,
        patientName: patient.name,
        patientDoB: patient.DoB,
        examinationDate: examination.examinationDate,
        examinationPlanDate: examination.examinationPlanDate,
        picId: pic._id,
        picName: pic.name,
      });
    }
  }

  return {
    message: "Examination data received successfully",
    data: responseData,
  };
};

exports.getStatisticsTodoLab = async function (params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const totalFinished = await Examination.countDocuments({
    PIC: userId,
    statusExamination: "FINISHED",
  });

  const totalNotFinished = await Examination.countDocuments({
    PIC: userId,
    statusExamination: { $ne: "FINISHED" },
  });

  const statistics = {
    totalFinished,
    totalNotFinished,
  };

  return {
    message: "Statistics data received successfully",
    data: statistics,
  };
};

exports.getMonthlyExaminations = async function (params) {
  const { month, year } = params;
  if (!month || month === ":month") {
    throw new Error("Month is required");
  }
  if (!year || year === ":year") {
    throw new Error("Year is required");
  }

  const DECIMAL_BASE = 10;
  const FIRST_DAY_OF_MONTH = 1;

  const monthNum = parseInt(month, DECIMAL_BASE);
  const yearNum = parseInt(year, DECIMAL_BASE);

  const startDate = new Date(yearNum, monthNum - 1, FIRST_DAY_OF_MONTH);
  const endDate = new Date(yearNum, monthNum, FIRST_DAY_OF_MONTH);

  const examinations = await Examination.find({
    examinationDate: {
      $gte: startDate,
      $lt: endDate,
    },
  }).sort({ examinationDate: 1 }); // Sort in ascending order

  const responseData = [];

  for (const examination of examinations) {
    const patient = await Patient.findOne({
      resultExamination: { $in: [examination._id] },
    });

    if (patient) {
      responseData.push({
        examinationId: examination._id,
        slideId: examination.slideId,
        statusExamination: examination.statusExamination,
        patientId: patient._id,
        patientName: patient.name,
        patientDoB: patient.DoB,
        examinationDate: examination.examinationDate,
      });
    }
  }

  return {
    message: "Examination data received successfully",
    data: responseData,
  };
};
