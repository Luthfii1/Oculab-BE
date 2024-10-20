const ExaminationService = require("../services/Examination.service");

exports.createExamination = async function (req, res) {
  try {
    const result = await ExaminationService.createExamination(
      req.params,
      req.body
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getExaminationsByUser = async function (req, res) {
  try {
    const result = await ExaminationService.getExaminationsByUser(req.params);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateExaminationResult = async function (req, res) {
  try {
    const result = await ExaminationService.updateExaminationResult(
      req.params,
      req.body
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getExaminationById = async function (req, res) {
  try {
    const result = await ExaminationService.getExaminationById(req.params);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getNumberOfExaminations = async function (req, res) {
  try {
    const result = await ExaminationService.getNumberOfExaminations();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.postSystemDiagnosis = async function (req, res) {

  const { examinationId } = req.params;
  const video = req.file

  if (!video) {
    return res.status(400).send({ message: "Video file is required in controller" });
  }

  if (!examinationId) {
    return res.status(400).send({ message: "Examination ID is required" });
  }

  try {
    const result = await ExaminationService.postSystemDiagnosis(
      req.params,
      video
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
