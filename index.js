// Import required modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const setupSocket = require("./src/socket/SocketHandler");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/config/db");
const modelBackend = require("./src/config/modelBackend");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
setupSocket(io);

// Import routes and other files here
const { getHomePage } = require("./src/utils/LandingPage");
const patientRoutes = require("./src/routes/Patient.routes");
const examinationRoutes = require("./src/routes/Examination.routes");
const fovRoutes = require("./src/routes/Fov.routes");
const userRoutes = require("./src/routes/User.routes");
const systemResultRoutes = require("./src/routes/SystemExamResult.routes");
const expertResultRoutes = require("./src/routes/ExpertExamResult.routes");
const aiAnalysisProgressRoutes = require("./src/routes/AIAnalysisProgressTracking.routes");
const contactRoutes = require("./src/routes/Contact.routes");

const constants = require("./src/config/constants");

// Set up the server
dotenv.config();
db.connectDB();
modelBackend.connectModelBackend();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes used in the application
app.get("/", getHomePage);
app.use("/patient", patientRoutes);
app.use("/examination", examinationRoutes);
app.use("/fov", fovRoutes);
app.use("/user", userRoutes);
app.use("/systemResult", systemResultRoutes);
app.use("/expertResult", expertResultRoutes);
app.use("/aiAnalysisProgress", aiAnalysisProgressRoutes);
app.use("/contact", contactRoutes);

const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
