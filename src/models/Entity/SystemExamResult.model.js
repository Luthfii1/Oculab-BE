const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { GradingType } = require("../Enum/GradingType.enum");

const SystemExamResultSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  systemGrading: {
    type: String,
    enum: GradingType,
    required: true,
  },
  confidenceLevelAggregated: {
    type: mongoose.Decimal128,
    required: true,
  },
  systemBacteriaTotalCount: {
    type: Number,
    required: true,
  },
});

const SystemExamResult = mongoose.model(
  "SystemExamResult",
  SystemExamResultSchema
);

module.exports = {
  SystemExamResult,
  SystemExamResultSchema,
};
