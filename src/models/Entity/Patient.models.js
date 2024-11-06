const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { SexType } = require("../Enum/SexType.enum");

const PatientSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    NIK: {
      type: String,
      required: true,
    },
    DoB: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      enum: SexType,
      required: true,
    },
    BPJS: {
      type: String,
      required: false,
    },
    resultExamination: {
      type: [String],
      required: false,
    },
  },
  { versionKey: false } // Disables the __v field for versioning
);

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = {
  Patient,
  PatientSchema,
};
