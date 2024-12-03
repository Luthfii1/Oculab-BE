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
    switch (error.message) {
      case "Patient ID is required":
      case "Examination goal type is required":
      case "Examination preparation type is required":
      case "Slide ID is required":
      case "Examination date is required":
      case "PIC ID is required":
      case "DPJP ID is required":
      case "Examination plan date is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required data."
        );
        break;
      case "Patient not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "No patient found with the provided patient ID."
        );
        break;
      case "Examination ID already exists":
      case "A patient with the provided slide ID already exists":
        sendResponse(
          res,
          ResponseType.ERROR,
          409,
          error.message,
          null,
          ErrorResponseType.CONFLICT_ERROR,
          "The provided data already exists."
        );
        break;
      case "No matching PIC or Lab Technician found for the provided ID":
      case "No matching DPJP found for the provided ID":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "No matching staff found for the provided ID."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.message || "An unexpected error occurred."
        );
        break;
    }
  }
};

exports.getExaminationsByUser = async function (req, res) {
  try {
    const result = await ExaminationService.getExaminationsByUser(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    switch (error.message) {
      case "Patient ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required patient's ID."
        );
        break;
      case "Patient not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "No patient found with the provided patient ID."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.message || "An unexpected error occurred."
        );
        break;
    }
  }
};

exports.updateExaminationResult = async function (req, res) {
  try {
    const result = await ExaminationService.updateExaminationResult(
      req.params,
      req.body
    );
    sendResponse(res, ResponseType.SUCCESS, 201, result.message, result.data);
  } catch (error) {
    switch (error.message) {
      case "Patient ID is required":
      case "Examination ID is required":
      case "Examination data is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required data"
        );
        break;
      case "Patient not found":
      case "Examination not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "No data found with the provided ID."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.message || "An unexpected error occurred."
        );
        break;
    }
  }
};

exports.getExaminationById = async function (req, res) {
  try {
    const result = await ExaminationService.getExaminationById(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    switch (error.message) {
      case "Examination ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required examination ID."
        );
        break;
      case "Examination not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "No examination found with the provided examination ID."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.message || "An unexpected error occurred."
        );
        break;
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
    switch (error.message) {
      case "Examination ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required ID."
        );
        break;
      case "Examination not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "No data found with the provided ID."
        );
        break;
      case "Failed to forward video to ML":
      case "Video is required":
      case "Failed to remove video":
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.description
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.message || "An unexpected error occurred."
        );
        break;
    }
  }
};

exports.getAllExaminations = async function (req, res) {
  try {
    const result = await ExaminationService.getAllExaminations(req.params);
    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    switch (error.message) {
      case "User ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required user ID."
        );
        break;
      default:
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
    switch (error.message) {
      case "Month is required":
      case "Year is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required month or year."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_SERVER,
          error.message || "An unexpected error occurred."
        );
        break;
    }
  }
};
