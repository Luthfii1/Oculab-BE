const expertResultServices = require("../services/ExpertExamResult.services");

exports.postExpertResult = async function (req, res) {
  try {
    const result = await expertResultServices.postExpertResult(
      req.body,
      req.params
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
