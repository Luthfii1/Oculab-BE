const patientServices = require("../services/Patient.services");

exports.newInputPatient = async function (req, res) {
  try {
    const result = await patientServices.newInputPatient(req.body);
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
