const jwt = require("jsonwebtoken");
const { ResponseType } = require("../models/Enum/ResponseType.enum");
const sendResponse = require("../utils/Response.utilities");
const { ErrorResponseType } = require("../models/Enum/ErrorResponseType.enum");

const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;

function authenticateToken(req, res, next) {
  const authenticationHeader = req.headers["authorization"];
  const token = authenticationHeader && authenticationHeader.split(" ")[1];

  if (!token) {
    sendResponse(
      res,
      ResponseType.ERROR,
      401,
      "No token provided",
      null,
      ErrorResponseType.PERMISSION_ERROR,
      "No token provided"
    );
  }

  jwt.verify(token, accessToken, (err, decoded) => {
    if (err) {
      sendResponse(
        res,
        ResponseType.ERROR,
        403,
        "Failed to authenticate token",
        null,
        ErrorResponseType.PERMISSION_ERROR,
        "Failed to authenticate token"
      );
    }

    req.body.tokenUserId = decoded.userId;
    req.body.tokenRole = decoded.role;
    next();
  });
}

function authenticateRefreshToken(req, res, next) {
  const authenticationHeader = req.headers["authorization"];
  const token = authenticationHeader && authenticationHeader.split(" ")[1];

  if (!token) {
    sendResponse(
      res,
      ResponseType.ERROR,
      401,
      "No token provided",
      null,
      ErrorResponseType.PERMISSION_ERROR,
      "No token provided"
    );
  }

  jwt.verify(token, refreshToken, (err, decoded) => {
    if (err) {
      sendResponse(
        res,
        ResponseType.ERROR,
        403,
        "Failed to authenticate token",
        null,
        ErrorResponseType.PERMISSION_ERROR,
        "Failed to authenticate token"
      );
    }

    req.body.tokenUserId = decoded.userId;
    req.body.tokenRole = decoded.role;
    next();
  });
}

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
};
