const userServices = require("../services/User.service");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

exports.login = async function (req, res) {
  try {
    const result = await userServices.login(req.body);
    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "User logged in successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "Email and password are required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.INTERNAL_VALIDATION_ERROR,
          "Email and password are required"
        );
        break;
      case "User doesn't exist":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "User doesn't exist"
        );
        break;
      case "Incorrect password":
        sendResponse(
          res,
          ResponseType.ERROR,
          401,
          error.message,
          null,
          ErrorResponseType.PERMISSION_ERROR,
          "Incorrect password"
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

exports.register = async function (req, res) {
  try {
    const result = await userServices.register(req.body);
    sendResponse(
      res,
      ResponseType.SUCCESS,
      201,
      "User registered successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "Name is required":
      case "Role is required":
      case "Email is required":
      case "Password is required":
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
      case "User already exists":
        sendResponse(
          res,
          ResponseType.ERROR,
          409,
          error.message,
          null,
          ErrorResponseType.CONFLICT_ERROR,
          "User already exists"
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
          "The user ID provided already exists."
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

exports.refreshToken = async function (req, res) {
  try {
    const result = await userServices.refreshToken(req.body, req.params);
    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "Token refreshed successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "User ID is required":
      case "Token ID is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          "The request is missing the required field."
        );
        break;
      case "token and id is not valid":
        sendResponse(
          res,
          ResponseType.ERROR,
          401,
          error.message,
          null,
          ErrorResponseType.PERMISSION_ERROR,
          "Token and ID is not valid"
        );
        break;
      case "User not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "User not found"
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

exports.getAllUsers = async function (req, res) {
  try {
    const result = await userServices.getAllUsers();

    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "All users received successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "User not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "User not found"
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

exports.getUserById = async function (req, res) {
  try {
    const result = await userServices.getUserById(req.params);

    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "User received successfully",
      result
    );
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
          "User ID is required"
        );
        break;
      case "User not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "User not found"
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

exports.getAllPics = async function (req, res) {
  try {
    const result = await userServices.getAllPics();

    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "All users received successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "User not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "User not found"
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

exports.updateUser = async function (req, res) {
  try {
    const result = await userServices.updateUser(req.body, req.params);

    sendResponse(
      res,
      ResponseType.SUCCESS,
      200,
      "User updated successfully",
      result
    );
  } catch (error) {
    switch (error.message) {
      case "User ID is required":
      case "Previous password is required":
        sendResponse(
          res,
          ResponseType.ERROR,
          400,
          error.message,
          null,
          ErrorResponseType.VALIDATION_ERROR,
          error.message
        );
        break;
      case "User not found":
        sendResponse(
          res,
          ResponseType.ERROR,
          404,
          error.message,
          null,
          ErrorResponseType.RESOURCE_NOT_FOUND,
          "User not found"
        );
        break;
      case "Incorrect previous password":
        sendResponse(
          res,
          ResponseType.ERROR,
          401,
          error.message,
          null,
          ErrorResponseType.PERMISSION_ERROR,
          "Incorrect previous password"
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
