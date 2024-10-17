const ExaminationService = require("../services/Examination.service");

exports.newInputExamination = async function (req, res) {
  try {
    const result = await ExaminationService.newInputExamination(
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
