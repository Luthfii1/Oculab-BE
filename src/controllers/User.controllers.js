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
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async function (req, res) {
  try {
    const result = await userServices.refreshToken(req.body, req.params);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async function (req, res) {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async function (req, res) {
  try {
    const result = await userServices.getUserById(req.params);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPics = async function (req, res) {
  try {
    const result = await userServices.getAllPics();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async function (req, res) {
  try {
    const result = await userServices.updateUser(req.body, req.params);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
