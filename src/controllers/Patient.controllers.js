const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const patientServices = require("../services/Patient.services");
const sendResponse = require("../utils/Response.utilities");

exports.createNewPatient = async function (req, res) {
  try {
    const result = await patientServices.createNewPatient(req.body);
    sendResponse(res, ResponseType.SUCCESS, 201, result.message, result.data);
  } catch (error) {
    if (error.message === "Name is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's name."
      );
    } else if (error.message === "NIK is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's NIK."
      );
    } else if (
      error.message === "A patient with the provided NIK already exists"
    ) {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided patient's NIK already exists."
      );
    } else if (error.message === "A valid NIK format is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided patient's NIK must be a 16-digit number with no spaces or special characters."
      );
    } else if (error.message === "Date of Birth is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's Date of Birth."
      );
    } else if (error.message === "Sex is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's sex."
      );
    } else if (
      error.message === "A patient with the provided BPJS already exists"
    ) {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided patient's BPJS already exists."
      );
    } else if (error.message === "A valid BPJS format is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided patient's BPJS must be a 13-digit number with no spaces or special characters."
      );
    } else if (
      error.message === "A patient with the provided ID already exists"
    ) {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided patient's ID already exists."
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

exports.updatePatient = async function (req, res) {
  try {
    const result = await patientServices.updatePatient(req.body, req.params);
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
        "The request is missing the patient's ID."
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
    } else if (error.message === "A valid BPJS format is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The provided patient's BPJS must be a 13-digit number with no spaces or special characters."
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

exports.getAllPatients = async function (req, res) {
  try {
    const result = await patientServices.getAllPatients();
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

exports.getPatientById = async function (req, res) {
  try {
    const result = await patientServices.getPatientById(req.params);
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
        "The request is missing the patient's ID."
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

exports.getAllPatientsByName = async function (req, res) {
  try {
    const result = await patientServices.getAllPatientsByName(req.params);
    res.status(200).json({
      status: "success",
      code: 200,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    if (error.message === "Patient name is required") {
      sendResponse(
        res,
        ResponseType.ERROR,
        400,
        error.message,
        null,
        ErrorResponseType.VALIDATION_ERROR,
        "The request is missing the required patient's name."
      );
    } else {
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
