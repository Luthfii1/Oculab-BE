const dotenv = require("dotenv");
dotenv.config();

// Example URL and config constants
const MODEL_URL = process.env.MODEL_URL || "http://127.0.0.1:5000";

const URL_EXTRACT_VIDEO = `${MODEL_URL}/extract-video`;
const CHECKER_URL = `${MODEL_URL}/check-connection`;
const CHECK_VIDEO = `${MODEL_URL}/check-video`;

module.exports = {
  URL_EXTRACT_VIDEO,
  CHECKER_URL,
  CHECK_VIDEO,
};
