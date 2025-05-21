const boundingBoxService = require("../services/BoundingBoxData.services");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

exports.getBoundingBoxesByFovId = async function (req, res) {
  try {
    const result = await boundingBoxService.getBoundingBoxesByFovId(req.params);

    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    switch (error.message) {
      case "FOV ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required FOV ID."
        );
        break;
      case "FOV not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "No FOV found for the provided ID."
        );
        break;
      case "No bounding box data available yet for this FOV":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "The FOV exists but does not have any bounding box data yet."
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

exports.updateBoxStatusByBoxId = async function (req, res) {
  try {
    const result = await boundingBoxService.updateBoxStatusByBoxId(
      req.params,
      req.body
    );

    sendResponse(res, ResponseType.SUCCESS, 200, result.message, result.data);
  } catch (error) {
    switch (error.message) {
      case "Bounding Box ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required box ID."
        );
        break;
      case "Box status is required in request body":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request body must include a boxStatus field."
        );
        break;
      case "Box not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "No box found for the provided ID."
        );
        break;
      default:
        if (error.message.startsWith("Invalid box status")) {
          sendResponse(
            res,
            ResponseType.ERROR,
            400,
            error.message,
            null,
            ErrorResponseType.VALIDATION_ERROR,
            "The provided box status is not valid."
          );
        } else {
          sendResponse(
            res,
            ResponseType.ERROR,
            500,
            error.message,
            null,
            ErrorResponseType.INTERNAL_ERROR,
            "An error occurred while processing the request."
          );
        }
        break;
    }
  }
};
