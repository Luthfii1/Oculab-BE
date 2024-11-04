const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");
const mongoose = require("mongoose");
const { response } = require("express");

exports.postFOVData = async function (params, body) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const { fovData } = body;
  if (!fovData) {
    throw new Error("FOVData is required");
  }

  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }

  const patient = await Patient.findOne({
    "resultExamination._id": examination._id,
  });
  if (!patient) {
    throw new Error("Patient not found");
  }

  // start session and transaction to ensure data consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newFOVData = new FOVData(fovData);
    const savedFOVData = await newFOVData.save({ session });
    examination.fov.push(newFOVData);
    await examination.save({ session });

    //   save to user and update the resultExamination with the new examination
    await Patient.updateOne(
      { "resultExamination._id": examination._id },
      {
        $push: { "resultExamination.$.fov": savedFOVData },
      }
    ).session(session);

    // commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: "FOVData received successfully",
      data: newFOVData,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getAllFOVByExaminationId = async function (params) {
  const { examinationId } = params;
  if (!examinationId) {
    throw new Error("Examination ID is required");
  }

  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }

  if (examination.FOV.length === 0) {
    return {
      message: "FOVData received successfully",
      data: {},
    };
  }

  const allFovsId = examination.FOV;
  const fovBta0 = [];
  const fovBta1to9 = [];
  const fovBtaAbove9 = [];

  for (const fovId of allFovsId) {
    const fov = await FOVData.findById(fovId);
    const fovResponse = fov.toObject();
    delete fovResponse.__v;

    if (fovResponse.type === "BTA0") {
      fovBta0.push(fovResponse);
    } else if (fovResponse.type === "BTA1TO9") {
      fovBta1to9.push(fovResponse);
    } else {
      fovBtaAbove9.push(fovResponse);
    }
  }

  const responseData = {
    BTA0: fovBta0,
    BTA1TO9: fovBta1to9,
    BTAABOVE9: fovBtaAbove9,
  };

  return {
    message: "FOVData received successfully",
    data: responseData,
  };
};
