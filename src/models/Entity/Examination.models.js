const mongoose = require("mongoose");
const { FOVDataSchema } = require("./FOVData.models");
const { ExamGoalType } = require("../Enum/ExamGoalType.enum");
const { ExamPreparationType } = require("../Enum/ExamPreparationType.enum");
const { StatusExaminationType } = require("../Enum/StatusExaminationType.enum");
const { SystemExamResultSchema } = require("./SystemExamResult.model");
const { ExpertExamResultSchema } = require("./ExpertExamResult.model");
const { UserSchema } = require("./User.model");

const ExaminationSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    enum: ExamGoalType,
    required: true,
  },
  preparationType: {
    type: String,
    enum: ExamPreparationType,
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
  FOV: {
    type: [FOVDataSchema],
    required: false,
  },
  imagePreview: {
    type: String,
    required: true,
    default:
      process.env.IMAGE_PREVIEW + "/eead8004-2fd7-4f40-be1f-1d02cb886af4.png",
  },
  statusExamination: {
    type: String,
    required: true,
    enum: StatusExaminationType,
    default: StatusExaminationType.NOTSTARTED,
  },
  systemResult: {
    type: SystemExamResultSchema,
    required: false,
  },
  expertResult: {
    type: ExpertExamResultSchema,
    required: false,
  },
  PIC: {
    type: UserSchema,
    required: true,
  },
  examinationPlanDate: {
    type: Date,
    required: true,
  },
});

const Examination = mongoose.model("Examination", ExaminationSchema);

module.exports = {
  ExaminationSchema,
  Examination,
};
