const mongoose = require("mongoose");
const { GradingType } = require("../Enum/GradingType.enum");

const SystemExamResultSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  systemGrading: {
    type: String,
    enum: GradingType,
    required: true,
  },
  confidenceLevelAggregated: {
    type: Number,
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
