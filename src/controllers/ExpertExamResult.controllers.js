const expertResultServices = require("../services/ExpertExamResult.services");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

exports.postExpertResult = async function (req, res) {
  try {
    const result = await expertResultServices.postExpertResult(
      req.body,
      req.params
    );

    sendResponse(
      res,
      ResponseType.SUCCESS,
      201,
      "Expert result created successfully",
      result
    );
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
      case "Final grading is required":
      case "Bacteria total count is required":
      case "Notes is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request body is missing the required field."
        );
        break;
      case "Examination not found":
      case "Patient not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "No examination or patient found for the provided ID."
        );
        break;
      case "Duplicate ID":
        sendResponse(
          res,
          ResponseType.ERROR,
          409,
          error.message,
          null,
          ErrorResponseType.CONFLICT_ERROR,
          "The expert result ID provided already exists."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_VALIDATION_ERROR,
          "An error occurred while processing the request."
        );
        break;
    }
  }
};
