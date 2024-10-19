const mongoose = require("mongoose");
const { FOVDataSchema } = require("./FOVData.models");

const ExamGoalType = Object.freeze({
  SCREENING: "SCREENING",
  TREATMENT: "TREATMENT",
});

const ExamPreparationType = Object.freeze({
  SPS: "SPS",
  SP: "SP",
});

const GradingType = Object.freeze({
  NEGATIVE: "NEGATIVE",
  SCANTY: "SCANTY",
  Plus1: "Positive 1+",
  Plus2: "Positive 2+",
  Plus3: "Positive 3+",
});

const StatusExaminationType = Object.freeze({
  INPROGRESS: "In Progress",
  FINISHED: "Finished",
});

const ExaminationSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    enum: Object.values(ExamGoalType),
    required: true,
  },
  preparationType: {
    type: String,
    enum: Object.values(ExamPreparationType),
    required: true,
  },
  slideId: {
    type: String,
    required: true,
  },
  recordVideo: {
    type: Buffer,
    required: false,
  },
  WSI: {
    type: String,
    required: false,
  },
  examinationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  fov: {
    type: [FOVDataSchema],
    required: false,
  },
  statusExamination: {
    type: String,
    required: true,
    enum: StatusExaminationType,
    default: StatusExaminationType.INPROGRESS,
  },
  systemGrading: {
    type: String,
    enum: Object.values(GradingType),
    required: false,
  },
  confidenceLevelAggregated: {
    type: Number,
    required: false,
  },
  finalGrading: {
    type: String,
    enum: Object.values(GradingType),
    required: false,
  },
  systemBacteriaTotalCount: {
    type: Number,
    required: true,
  },
  bacteriaTotalCount: {
    type: Number,
    required: false,
  },
  notes: {
    type: String,
    required: true,
    default: "",
  },
});

const Examination = mongoose.model("Examination", ExaminationSchema);

module.exports = {
  ExaminationSchema,
  Examination,
};
