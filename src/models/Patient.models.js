const mongoose = require("mongoose");
const { ExaminationSchema } = require("./Examination.models");

const SexType = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
});

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
    enum: Object.values(SexType),
    required: true,
  },
  BPJS: {
    type: String,
    required: false,
  },
  resultExamination: [ExaminationSchema],
});

const Patient = mongoose.model("Patient", PatientSchema);
module.exports = {
  Patient,
  PatientSchema,
};
