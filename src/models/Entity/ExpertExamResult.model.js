const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { GradingType } = require("../Enum/GradingType.enum");

const ExpertExamResultSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  finalGrading: {
    type: String,
    enum: GradingType,
    required: true,
  },
  bacteriaTotalCount: {
    type: Number,
    required: false,
  },
  notes: {
    type: String,
    required: true,
  },
});

const ExpertExamResult = mongoose.model(
  "ExpertExamResult",
  ExpertExamResultSchema
);

module.exports = {
  ExpertExamResult,
  ExpertExamResultSchema,
};
