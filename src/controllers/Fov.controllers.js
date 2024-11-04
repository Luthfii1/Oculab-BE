const fovService = require("../services/Fov.services");

exports.postFOVData = async function (req, res) {
  try {
    const result = await fovService.postFOVData(req.params, req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllFOVByExaminationId = async function (req, res) {
  try {
    const result = await fovService.getAllFOVByExaminationId(req.params);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}