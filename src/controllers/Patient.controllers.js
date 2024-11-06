const patientServices = require("../services/Patient.services");

exports.createNewPatient = async function (req, res) {
  try {
    const result = await patientServices.createNewPatient(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updatePatient = async function (req, res) {
  try {
    const result = await patientServices.updatePatient(req.body, req.params);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllPatients = async function (req, res) {
  try {
    const result = await patientServices.getAllPatients();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getPatientById = async function (req, res) {
  try {
    const result = await patientServices.getPatientById(req.params);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllPatientsByName = async function (req, res) {
  try {
    const result = await patientServices.getAllPatientsByName(req.params);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
