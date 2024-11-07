const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { ExamGoalType } = require("../Enum/ExamGoalType.enum");
const { ExamPreparationType } = require("../Enum/ExamPreparationType.enum");
const { StatusExaminationType } = require("../Enum/StatusExaminationType.enum");

const ExaminationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
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
    PDF: {
      type: String,
      required: false,
    },
    examinationDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    FOV: {
      type: [String],
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
      type: String,
      required: false,
    },
    expertResult: {
      type: String,
      required: false,
    },
    PIC: {
      type: String,
      required: true,
    },
    examinationPlanDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    DPJP: {
      type: String,
      required: true,
    },
  },
  { versionKey: false } // Disables the __v field for versioning
);

const Examination = mongoose.model("Examination", ExaminationSchema);

module.exports = {
  ExaminationSchema,
  Examination,
};
