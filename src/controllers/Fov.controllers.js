const fovService = require("../services/Fov.services");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

exports.postFOVData = async function (req, res) {
  try {
    const result = await fovService.postFOVData(req.params, req.body);
    sendResponse(
      res,
      ResponseType.SUCCESS,
      201,
      "FOV data created successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "Examination ID is required":
      case "Image is required":
      case "Type is required":
      case "Order is required":
      case "System count is required":
      case "Confidence level is required":
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
      case "Patient not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "No examination found for the provided ID."
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
          "The FOV data ID provided already exists."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_ERROR,
          "An error occurred while processing the request."
        );
        break;
    }
  }
};

exports.getAllFOVByExaminationId = async function (req, res) {
  try {
    const result = await fovService.getAllFOVByExaminationId(req.params);

    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "FOV data retrieved successfully",
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
      case "Examination not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "No examination found for the provided ID."
        );
        break;
      default:
        sendResponse(
          res,
          ResponseType.ERROR,
          500,
          error.message,
          null,
          ErrorResponseType.INTERNAL_ERROR,
          "An error occurred while processing the request."
        );
        break;
    }
  }
};
