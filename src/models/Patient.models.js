const mongoose = require("mongoose");
const { ExaminationSchema } = require("./Examination.models");

const SexType = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
});

const PatientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nik: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: Object.values(SexType),
    required: true,
  },
  bpjs: {
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
