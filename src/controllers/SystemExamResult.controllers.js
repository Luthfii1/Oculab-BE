const systemResultServices = require("../services/SystemExamResult.services");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

exports.postSystemResult = async function (req, res) {
  try {
    const result = await systemResultServices.postSystemResult(
      req.body,
      req.params
    );

    sendResponse(
      res,
      ResponseType.SUCCESS,
      201,
      "System result created successfully",
      result
    );
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
        "error",
        404,
        error.message,
        null,
        ErrorResponseType.RESOURCE_NOT_FOUND,
        "No examination found for the provided ID."
      );
    } else if (error.message === "Patient not found") {
      sendResponse(
        res,
        "error",
        404,
        error.message,
        null,
        ErrorResponseType.RESOURCE_NOT_FOUND,
        "No patient found associated with the examination."
      );
    } else if (error.message === "Duplicate ID") {
      sendResponse(
        res,
        "error",
        400,
        error.message,
        null,
        ErrorResponseType.CONFLICT_ERROR,
        "The system result ID provided already exists."
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
