const systemResultServices = require("../services/SystemExamResult.services");

exports.postSystemResult = async function (req, res) {
  try {
    const result = await systemResultServices.postSystemResult(
      req.body,
      req.params
    );
    res.status(200).json({
      status: "success",
      code: 200,
      message: "System result received successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
