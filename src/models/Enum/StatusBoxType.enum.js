const mongoose = require("mongoose");

const StatusBoxType = Object.freeze({
  UNVERIFIED: "UNVERIFIED",
  VERIFIED: "VERIFIED",
  FLAGGED: "FLAGGED",
  DELETED: "DELETED",
});

module.exports = { StatusBoxType };
