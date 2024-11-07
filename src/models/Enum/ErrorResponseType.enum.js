const ErrorResponseType = Object.freeze({
  VALIDATION_ERROR: "VALIDATION_ERROR", // Input data failed validation
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND", // Requested resource does not exist
  SERVER_ERROR: "SERVER_ERROR", // General server error, such as an unhandled exception
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR", // User failed authentication
  PERMISSION_ERROR: "PERMISSION_ERROR", // User does not have permission to perform the requested action
  INTERNAL_VALIDATION_ERROR: "INTERNAL_VALIDATION_ERROR", // Internal validation failed
  CONFLICT_ERROR: "CONFLICT_ERROR", // Conflict (e.g., duplicate entries)
});

module.exports = { ErrorResponseType };
