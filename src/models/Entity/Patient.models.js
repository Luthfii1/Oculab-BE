const mongoose = require("mongoose");
const { SexType } = require("../Enum/SexType.enum");

const PatientSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
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
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = {
  Patient,
  PatientSchema,
};
