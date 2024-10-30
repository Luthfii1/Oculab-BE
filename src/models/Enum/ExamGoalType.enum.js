const mongoose = require("mongoose");

const ExamGoalType = Object.freeze({
  SCREENING: "SCREENING",
  TREATMENT: "TREATMENT",
});

module.exports = { ExamGoalType };
