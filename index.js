// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/config/db");
const app = express();

// Import routes and other files here
const { getHomePage } = require("./src/utils/LandingPage");

// Set up the server
dotenv.config();
db.connectDB();
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // Will be moved to separate file
// const Patient = require("./src/models/Patient.model.js");
// const Examination = require("./src/models/Examination.model.js");
// const FOVData = require("./src/models/FOVData.model.js");
// // End of will be moved to separate file

// //Save (Post) all patient data
// app.post("/send-patient-data", async (req, res) => {
//   let dataPatient = req.body;
//   console.log("data:", dataPatient);
//   try {
//     const newPatient = new Patient(req.body.patient);
//     await newPatient.save();

//     res.status(200).send({
//       message: "Patient data received successfully",
//       data: newPatient,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });

// //Save (Post) all examination data
// app.post("/send-examination-data", async (req, res) => {
//   let dataExamination = req.body;
//   console.log("data:", dataExamination);
//   try {
//     const newExamination = new Examination(req.body.examination);
//     await newExamination.save();

//     res.status(200).send({
//       message: "Examination data received successfully",
//       data: newExamination,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });

// //Save (Post) initial examination data (before record) (Examination - fase 1)

// //Save (Post) Video to Analyze and Save Data (Examination - fase 2)
// app.post("/video-sent", (req, res) => {});

// //Save (Post) fovdata system result (after record) -> system grading & bacteria total count (FOVData - fase 1)

// //Save (Put/Update by fovId) fovdata manual input by user (after system result is generated) (FOVData - fase 2)

// //Save (Put/Update by examinationId) examination ai result (by system) (Examination - fase 3)

// //Save (Put/Update by examinationId) examination manual input (Examination - fase 4)

// // //Update (Put) Examination Result -> di examination,
// // app.put('/save-examination-result', (req, res) => {
// // })

// //Get all patient data
// app.get("/get-patient-data", async (req, res) => {
//   try {
//     const patient = await Patient.find(req.body).populate("resultExamination");

//     res.status(200).json(patient);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// //Get patient data by ID
// app.get("/get-patient-data/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const patient = await Patient.findById(id);

//     res.status(200).json(patient);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// //Get Examination by ID -> ini data full examination
// app.get("/get-examination-data/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const examination = await Examination.findById(id);

//     res.status(200).json(examination);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// //Get initial exam data by examinationId (Examination - fase 1)

// //Get fovdata system result (after record) by fovId (FOVData)

// //Get examination ai result (by system) by examinationId (Examination - fase 2)

// //Get examination manual input by examinationId  (Examination - fase 3)

// //Get number of gambar berd. FOVType (0, 1-9, >= 10) -> diitung len(arraynya) -> dimasukkin ke imageNumOf[FOVType] abis itu Post

// //Get Submitted Examination -> ini setelahnya dibikin logic gaboleh diubah2 lagi
// app.get("/get-submitted-examination", async (req, res) => {
//   try {
//     const examination = await Examination.find(req.body).populate("fov");

//     res.status(200).json(examination);
//   } catch (error) {
//     res.status(500).message({
//       message: error.message,
//     });
//   }
// });

// //Get Photo from FOVId -> image di fovdata
// app.get("/get-photo/:id", (req, res) => {
//   try {
//   } catch (error) {}
// });

// //Get Bacteria Photo Album -> whole fov, disort berdasarkan FOVType (BTA0, BTA1TO9, BTAABOVE9)
// app.get("/get-album", (req, res) => {
//   try {
//   } catch (error) {}
// });
