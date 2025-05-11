module.exports = function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join", (examId) => {
      console.log(`🟢 ${socket.id} joined room ${examId}`);
      socket.join(examId);

      let progress = 0;
      const interval = setInterval(() => {
        if (progress > 100) {
          io.to(examId).emit("analysis:update", {
            status: "completed",
            progress: 100,
          });
          clearInterval(interval);
          return;
        }

        io.to(examId).emit("analysis:update", {
          status: "analyzing",
          progress,
        });

        progress += 10;
      }, 1000);
    });
  });

  console.log("📡 WebSocket server initialized");
};
