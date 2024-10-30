const { FOVData } = require("../models/Entity/FOVData.models");
const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");
const mongoose = require("mongoose");

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
