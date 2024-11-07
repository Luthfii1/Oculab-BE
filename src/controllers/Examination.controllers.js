const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const ExaminationService = require("../services/Examination.service");
const sendResponse = require("../utils/Response.utilities");

exports.createExamination = async function (req, res) {
  try {
    const result = await ExaminationService.createExamination(
      req.params,
      req.body
    );
    sendResponse(res, ResponseType.SUCCESS, 201, result.message, result.data);
  } catch (error) {
    if (error.message === "Patient ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's ID."
      );
    } else if (error.message === "Examination goal type is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required examination goal."
      );
    } else if (error.message === "Examination preparation type is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required examination preparation type."
      );
    } else if (error.message === "Slide ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required slide ID."
      );
    } else if (error.message === "Examination date is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required examination date."
      );
    } else if (error.message === "PIC ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the assigned PIC ID or Lab Technician's ID."
      );
    } else if (error.message === "DPJP ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the assigned DPJP ID or Admin's ID."
      );
    } else if (error.message === "Examination plan date is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required examination plan date."
      );
    } else if (error.message === "Patient not found") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "No patient found with the provided patient ID."
      );
    } else if (error.message === "Examination ID already exists") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided examination ID already exists."
      );
    } else if (
      error.message === "A patient with the provided slide ID already exists"
    ) {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided slide ID already exists."
      );
    } else if (
      error.message ===
      "No matching PIC or Lab Technician found for the provided ID"
    ) {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided PIC or Lab Technician is not registered in the records."
      );
    } else if (
      error.message === "No matching DPJP or Admin found for the provided ID"
    ) {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided DPJP or Admin is not registered in the records."
      );
    } else {
      // Default to internal server error for unexpected errors
      sendResponse(
        res,
        "error",
        500,
        "Internal server error",
        null,
        ErrorResponseType.INTERNAL_SERVER,
        error.message || "An unexpected error occurred."
      );
    }
  }
};

exports.getExaminationsByUser = async function (req, res) {
  try {
    const result = await ExaminationService.getExaminationsByUser(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    if (error.message === "Patient ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's ID."
      );
    } else if (error.message === "Patient not found") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "No patient found with the provided patient ID."
      );
    } else {
      // Default to internal server error for unexpected errors
      sendResponse(
        res,
        "error",
        500,
        "Internal server error",
        null,
        ErrorResponseType.INTERNAL_SERVER,
        error.message || "An unexpected error occurred."
      );
    }
  }
};

// exports.updateExaminationResult = async function (req, res) {
//   try {
//     const result = await ExaminationService.updateExaminationResult(
//       req.params,
//       req.body
//     );
//     sendResponse(res, ResponseType.SUCCESS, 201, result.message, result.data);
//   } catch (error) {
//     if (error.message === "Patient ID is required") {
//       sendResponse(
//         res,
//         ResponseType.ERROR,
//         400,
//         error.message,
//         null,
//         ErrorResponseType.VALIDATION_ERROR,
//         "The request is missing the required patient's ID."
//       );
//     } else if (error.message === "Examination ID is required") {
//       sendResponse(
//         res,
//         ResponseType.ERROR,
//         400,
//         error.message,
//         null,
//         ErrorResponseType.VALIDATION_ERROR,
//         "The request is missing the required examination ID."
//       );
//     } else if (error.message === "Examination data is required") {
//       sendResponse(
//         res,
//         ResponseType.ERROR,
//         400,
//         error.message,
//         null,
//         ErrorResponseType.VALIDATION_ERROR,
//         "The request is missing the required examination data."
//       );
//     } else if (error.message === "Patient not found") {
//       sendResponse(
//         res,
//         ResponseType.ERROR,
//         400,
//         error.message,
//         "No patient found with the provided patient ID."
//       );
//     } else if (error.message === "Examination not found") {
//       sendResponse(
//         res,
//         ResponseType.ERROR,
//         400,
//         error.message,
//         null,
//         ErrorResponseType.VALIDATION_ERROR,
//         "No examination found with the provided examination ID."
//       );
//     } else {
//       // Default to internal server error for unexpected errors
//       sendResponse(
//         res,
//         "error",
//         500,
//         "Internal server error",
//         null,
//         ErrorResponseType.INTERNAL_SERVER,
//         error.message || "An unexpected error occurred."
//       );
//     }
//   }
// };

exports.getExaminationById = async function (req, res) {
  try {
    const result = await ExaminationService.getExaminationById(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    if (error.message === "Examination ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required examination ID."
      );
    } else if (error.message === "Examination not found") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "No examination found with the provided examination ID."
      );
    } else {
      // Default to internal server error for unexpected errors
      sendResponse(
        res,
        "error",
        500,
        "Internal server error",
        null,
        ErrorResponseType.INTERNAL_SERVER,
        error.message || "An unexpected error occurred."
      );
    }
  }
};

exports.getNumberOfExaminations = async function (req, res) {
  try {
    const result = await ExaminationService.getNumberOfExaminations();
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    sendResponse(
      res,
      "error",
      500,
      "Internal server error",
      null,
      ErrorResponseType.INTERNAL_SERVER,
      error.message || "An unexpected error occurred."
    );
  }
};

exports.forwardVideoToML = async function (req, res) {
  try {
    const result = await ExaminationService.forwardVideoToML(
      req.file,
      req.params
    );
    sendResponse(res, ResponseType.SUCCESS, 201, result.message, result.data);
  } catch (error) {
    if (error.message === "Patient ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's ID."
      );
    } else if (error.message === "Examination ID is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required examination ID."
      );
    } else if (error.message === "Video file is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required video file."
      );
    } else if (error.message === "Patient not found") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "No patient found with the provided patient ID."
      );
    } else if (error.message === "Examination not found") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "No examination found with the provided examination ID."
      );
    } else if (error.message === "Failed to forward video to ML service") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.INTERNAL_VALIDATION_ERROR,
        error.description
      );
    } else if (error.message === "Failed to remove video") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        error.description
      );
    } else {
      // Default to internal server error for unexpected errors
      sendResponse(
        res,
        "error",
        500,
        "Internal server error",
        null,
        ErrorResponseType.INTERNAL_SERVER,
        error.message || "An unexpected error occurred."
      );
    }
  }
};

exports.getAllExaminations = async function (req, res) {
  try {
    const result = await ExaminationService.getAllExaminations();
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    // Default to internal server error for unexpected errors
    sendResponse(
      res,
      "error",
      500,
      "Internal server error",
      null,
      ErrorResponseType.INTERNAL_SERVER,
      error.message || "An unexpected error occurred."
    );
  }
};

exports.getStatisticsTodoLab = async function (req, res) {
  try {
    const result = await ExaminationService.getStatisticsTodoLab(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    // Default to internal server error for unexpected errors
    sendResponse(
      res,
      "error",
      500,
      "Internal server error",
      null,
      ErrorResponseType.INTERNAL_SERVER,
      error.message || "An unexpected error occurred."
    );
  }
};

exports.getMonthlyExaminations = async function (req, res) {
  try {
    const result = await ExaminationService.getMonthlyExaminations(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    if (error.message === "Month is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.INTERNAL_VALIDATION_ERROR,
        "The request is missing the required month in Decimal Base format"
      );
    } else if (error.message === "Year is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required year in Decimal Base format"
      );
    } else if (error.message === "Failed to fetch monthly examinations") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        error.description
      );
    } else {
      // Default to internal server error for unexpected errors
      sendResponse(
        res,
        "error",
        500,
        "Internal server error",
        null,
        ErrorResponseType.INTERNAL_SERVER,
        error.message || "An unexpected error occurred."
      );
    }
  }
};
