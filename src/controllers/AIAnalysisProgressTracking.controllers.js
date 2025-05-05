const service = require("../services/AIAnalysisProgressTracking.service");

exports.simulateProgress = async (req, res) => {
  const { examId } = req.params;
  const { progress, status } = req.body;
  const io = req.app.get("socketio");

  if (progress == null || isNaN(progress)) {
    return res.status(400).json({ error: "progress must be a number" });
  }

  const intProgress = parseInt(progress, 10);
  const finalStatus =
    status || (intProgress >= 100 ? "completed" : "analyzing");

  await service.emitProgress(io, examId, finalStatus, intProgress);
  res.json({ success: true });
};

exports.simulateAutoProgress = async (req, res) => {
  const { examId } = req.params;
  const io = req.app.get("socketio");

  let progress = 0;

  const interval = setInterval(async () => {
    let status = "analyzing";
    if (progress >= 100) {
      clearInterval(interval);
      status = "completed";
    }

    await service.emitProgress(io, examId, status, progress);
    progress += 10;
  }, 1000);

  res.json({ message: `Auto simulation started for ${examId}` });
};
