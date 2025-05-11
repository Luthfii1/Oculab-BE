const contactService = require("../services/Contact.service");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

exports.getWhatsappLinkByContactId = async function (req, res) {
  try {
    const result = await contactService.getWhatsappLinkByContactId(req.params);

    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "Whatsapp contact received successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "Whatsapp contact ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "Whatsapp contact ID is required"
        );
        break;
      case "Whatsapp contact not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "Whatsapp contact not found"
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
          error.message
        );
        break;
    }
  }
};
