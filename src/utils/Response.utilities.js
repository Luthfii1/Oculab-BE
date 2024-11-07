/**
 * Helper function for sending a response (either success or error).
 * @param {object} res - The response object.
 * @param {string} status - The status of the response: 'success' or 'error'.
 * @param {number} code - The HTTP status code.
 * @param {string} message - The response message.
 * @param {object} data - The response data (optional).
 * @param {string} [errorType] - The type of error (required if status is 'error').
 * @param {string} [description] - Detailed description of the error (required if status is 'error').
 */
const sendResponse = (
  res,
  status,
  code,
  message,
  data,
  errorType = null,
  description = null
) => {
  const response = {
    status: status,
    code: code,
    message: message,
    data: data,
  };

  if (status === "error") {
    response.data = {
      errorType: errorType,
      description: description,
    };
  }

  res.status(code).json(response);
};

// Export the function
module.exports = sendResponse;
