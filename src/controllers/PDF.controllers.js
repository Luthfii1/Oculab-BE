const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const pdfService = require("../services/PDF.service");
const sendResponse = require("../utils/Response.utilities");

exports.getDataForPDF = async function (req, res) {
  try {
    const { examinationId } = req.params;
    
    if (!examinationId) {
      throw new Error("Examination ID is required");
    }

    const result = await pdfService.getDataForPDF(examinationId);
    sendResponse(
      res, 
      ResponseType.SUCCESS, 
      200, 
      result.message,
      result.data
    );
  } catch (error) {
    switch (error.message) {    
      case "Examination ID is required":
        sendResponse(res, ResponseType.ERROR, 400, error.message, null, ErrorResponseType.VALIDATION_ERROR, "Examination ID is required");
        break;
      case "Examination not found":
        sendResponse(res, ResponseType.ERROR, 404, error.message, null, ErrorResponseType.RESOURCE_NOT_FOUND, "Examination not found");
        break;
      case "Examination not finished":
        sendResponse(res, ResponseType.ERROR, 400, error.message, null, ErrorResponseType.VALIDATION_ERROR, "Examination not finished");
        break;
      case "Patient not found":
        sendResponse(res, ResponseType.ERROR, 404, error.message, null, ErrorResponseType.RESOURCE_NOT_FOUND, "Patient not found");
        break;
      case "Expert result not found":
        sendResponse(res, ResponseType.ERROR, 404, error.message, null, ErrorResponseType.RESOURCE_NOT_FOUND, "Expert result not found");
        break;
      case "Laborant not found":
        sendResponse(res, ResponseType.ERROR, 404, error.message, null, ErrorResponseType.RESOURCE_NOT_FOUND, "Laborant not found");
        break;
      default:
        sendResponse(res, ResponseType.ERROR, 500, error.message, null, ErrorResponseType.INTERNAL_VALIDATION_ERROR, error.message);
        break;
    }
  }
};