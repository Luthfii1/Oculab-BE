const userServices = require("../services/User.service");

exports.login = async function (req, res) {
  try {
    const result = await userServices.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
