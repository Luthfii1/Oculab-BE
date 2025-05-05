const express = require("express");
const router = express.Router();
const aiAnalysisProgressController = require("../controllers/AIAnalysisProgressTracking.controllers");

// Simulate progress for testing
router.post("/simulate/:examId", aiAnalysisProgressController.simulateProgress);

// Auto simulation (n+10 every 1s)
router.post(
  "/simulate-auto/:examId",
  aiAnalysisProgressController.simulateAutoProgress
);

module.exports = router;
