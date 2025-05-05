const redis = require("../config/redis");

const key = (examId) => `analysis:${examId}`;

exports.emitProgress = async (io, examId, status, progress) => {
  const data = { examId, status, progress };

  await redis.set(key(examId), JSON.stringify(data)); // optional: store in Redis
  io.to(examId).emit("analysis:update", data); // emit to room
};

exports.getProgress = async (examId) => {
  const raw = await redis.get(key(examId));
  return raw ? JSON.parse(raw) : null;
};
