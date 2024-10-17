const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;
const MONGO_URL = "mongodb+srv://aioculab:abipapiuncle@oculab-db.r6h3s.mongodb.net/be-api?retryWrites=true&w=majority&appName=oculab-db"

const { Patient } = require('./models/patient.model.js');
const {Examination} = require('./models/examination.model.js');
const {FOVData} = require('./models/FOVData.model.js');
// const { reset } = require('nodemon');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Muncul yey");
});

//Save (Post) all patient data 
app.post('/send-patient-data', async (req, res) => { 
    try {
        let dataPatient = req.body.patient;
        console.log("patient:", dataPatient);

        const examinationResults = dataPatient.resultExamination;

        // if(!dataPatient) {
        //     return res.status(400).json({
        //         message: "Patient data is not found!"
        //     });
        // }

        if (!Array.isArray(examinationResults)) {
            return res.status(400).json({ message: "resultExamination is missing or not an array" });
        }

        let savedExaminations = [];

        console.log("exam: ", examinationResults);

        for (const examination of examinationResults) {
            let savedFOVs = [];

            if (Array.isArray(examination.fov)) {
                for (const fov of examination.fov) {
                    if (!fov._id) {
                        return res.status(400).json({
                            message: "_id for FOV is required!"
                        });
                    }
                    const existingFOV = await FOVData.findById(fov._id);
                    if (existingFOV) {
                        return res.status(400).json({
                            message: `FOV with _id ${fov._id} already exists!`
                        });
                    }

                    const newFOVData = new FOVData(fov);
                    const savedFOV = await newFOVData.save();
                    savedFOVs.push(savedFOV);
                }
            } else {
                return res.status(400).json({
                    message: "FOVData is missing or not an array"
                });
            }
            
            if(!examination._id) {
                return res.status(400).json({
                    message: "_id for Examination is required!"
                });
            }
            examination.fov = savedFOVs;

            const newExamination = new Examination(examination);
            const savedExamination = await newExamination.save();
            savedExaminations.push(savedExamination);
        }

        dataPatient.resultExamination = savedExaminations;

        if (!dataPatient._id) {
            return res.status(400).json({
                message: "_id for Patient is required!"
            });
        }

        const newPatient = new Patient(dataPatient);
        await newPatient.save();

        res.status(200).json({
            message: 'Patient data received successfully',
            data: newPatient,
        });
    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});

//Save (Post) initial examination data by patient Id (before record) (Examination - fase 1)
app.post('/send-examination-data/:id', async (req, res) => {
    let { patientId  } = req.params;
    let dataExamination = req.body;

    console.log("data:", dataExamination);

    try {
        if (patientId == null) {
            res.status(404).json({
                message: "Patient ID not found!"
            })
        }

        const newExamination = new Examination(req.body.examination);
        await newExamination.save();

        res.status(200).json({
            message: 'Examination data received successfully',
            data: newExamination,
        });
    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});

// //Save (Post) examination data by Id (Video) to Analyze and Save Data (Examination - fase 2)
// app.post('/video-sent', (req, res) => {
//     //forwarding video ke api ML rasyad (diterusin aja, gak disimpen)
// });

//Save (Post) fovdata system result by examinationId (after record) -> system grading & bacteria total count (FOVData - fase 1)
app.post('/send-fov-data-system/:id', async (req, res) => {
    try {
        let { examinationId } = req.params;
        let dataFOV = req.body;

        console.log("data:", dataFOV);

        if (examinationId == null) {
            res.status(404).json({
                message: "Examination ID not found!"
            });
        }

        const newFOVData = new FOVData(req.body.FOVData);
        await newFOVData.save(); //save fovId (udah kegenerate)

        res.status(200).json({
            message: "FOV data received successfully",
            data: newFOVData
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.put('/update-patient-data/:id', async (req, res) => { //udah jalan
    try {
        let { id } = req.params;
        let patient = await Patient.findByIdAndUpdate(id, req.body.patient);

        console.log("data:", patient);

        if (patient == null) {
            return res.status(404).json({
                message: "Patient ID not found!"
            });
        }

        const updatedPatientData = await Patient.findById(id);
        res.status(200).json(updatedPatientData);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Save (Put/Update by fovId) fovdata manual input by user (after system result is generated) (FOVData - fase 2)
app.put('/send-fov-data-manual/:id', async (req, res) => {
    try {
        let { fovId } = req.params;
        let dataFOV = await FOVData.findByIdAndUpdate(fovId, req.body);

        console.log("data:", dataFOV);

        if (dataFOV == null) {
            return res.status(404).json({
                message: "FOV ID not found!"
            });
        }

        const updatedFOVData = await FOVData.findById(fovId);
        res.status(200).json(updatedFOVData);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Save (Put/Update by examinationId) examination ai result (by system) (Examination - fase 3)
//Save (Put/Update by examinationId) examination manual input (Examination - fase 4)
app.put('/send-examination-data-ai/:id', async (req, res) => {
    try {
        let { examinationId } = req.params;
        let examination = await Examination.findByIdAndUpdate(examinationId. req.body);

        if (examination == null) {
            return res.status(404).json({
                message: "Examination ID not found!"
            });
        }

        const updatedExamination = await Examination.findById(examinationId);
        res.status(200).json(updatedExamination);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Save (Put/Update by examinationId) examination manual input (Examination - fase 4)
// app.put('/send-examination-data-manual/:id', async (req, res) => {
//     try {
//         let { examinationId } = req.params;
//         let examination = await Examination.findByIdAndUpdate(examinationId, req.body);

//         if (examination == null) {
//             return res.status(404).json({
//                 message: "Examination ID not found!"
//             });
//         }

//         const updatedExamination = await Examination.findById(examinationId);
//         res.status(200).json(updatedExamination);
//     } catch(error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// });

// //Update (Put) Examination Result -> di examination, 
// app.put('/save-examination-result', (req, res) => {
// })

//Get all patient data 
app.get('/get-all-patient-data', async (req, res) => {
    try {
        let patients = await Patient.find().populate('resultExamination');
        res.status(200).json(patients);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Get a patient data by patientId
app.get('/get-patient-data/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let patient = await Patient.findById(id);

        if (patient == null) {
            return res.status(404).json({
                message: "Patient ID not found!"
            });
        }

        res.status(200).json(patient);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Get Examination by patientId -> ini data full examination per pasien
app.get('/get-examination-data-by-patient-id', async (req, res) => {
    try {
        let { patientId } = req.params;
        let examination = await Examination.findById(patientId);

        if (examination == null) {
            return res.status(404).json({
                message: "Patient ID not found!"
            });
        }

        res.status(200).json(examination);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Get Examination by examinationId -> ini data full examination
//Get initial exam data by examinationId (Examination - fase 1)
//Get examination ai result (by system) by examinationId (Examination - fase 2)
//Get examination manual input by examinationId  (Examination - fase 3)
app.get('/get-examination-data-by-examination-id/:id', async (req, res) => {
    try {
        let { examinationId } = req.params;
        let examination = await Examination.findById(examinationId);

        if (examination == null) {
            return res.status(404).json({
                message: "Examination ID not found!"
            });
        }
        res.status(200).json(examination);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});

//Get fovdata system result (after record) by fovId (FOVData)
app.get('/get-fov-data/:id', async (req, res) => {
    try {
        let { fovId } = req.params;
        let fovData = await FOVData.findById(fovId);

        if (fovData == null) {
            return res.status(404).json({
                message: "FOV ID not found!"
            });
        }

        res.status(200).json(fovData);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
})

//Get Image Count based on FOVType by examinationId -> diitung len(arraynya) -> dimasukkin ke imageNumOf[FOVType] abis itu Post
app.get('/get-image-count/:id', async (req, res) => {
    try {
        let { examinationId } = req.params;
        let fovData = await FOVData.findById(examinationId);

        let imageNumOfBTA0 = 0;
        let imageNumOfBTA1TO9 = 0;
        let imageNumOfBTAABOVE9 = 0;

        fovData.forEach(fov => {
            if (fov.type == 'BTA0') {
                imageNumOfBTA0++;
            } else if (fov.type == 'BTA1TO9') {
                imageNumOfBTA1TO9++;
            } else if (fov.type == 'BTAABOVE9') {
                imageNumOfBTAABOVE9++;
            }
        });

        res.status(200).json({
            imageNumOfBTA0,
            imageNumOfBTA1TO9,
            imageNumOfBTAABOVE9
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Get Submitted Examination by patientId -> ini setelahnya dibikin logic gaboleh diubah2 lagi
// app.get('/get-submitted-examination/:id', async (req, res) => {
//     try {
//         let { patientId } = req.params;
//         const examination = await Examination.findById(patientId)
//             .populate('fov');
        
//         res.status(200).json(examination);
//     } catch(error){
//         res.status(500).json({
//             message: error.message
//         })
//     }
// });

//Get Submitted Examination by examinationId -> ini setelahnya dibikin logic gaboleh diubah2 lagi
// app.get('/get-submitted-examination', async (req, res) => {
//     try {
//         let { examinationId } = req.params;
//         const examination = await Examination.findById(examinationId)
//             .populate('fov');
        
//         res.status(200).json(examination);
//     } catch(error){
//         res.status(500).json({
//             message: error.message
//         })
//     }
// });

//Get Photo from FOVId -> image di fovdata
app.get('/get-photo/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let fovData = await FOVData.findById(id);

        if (fovData == null || fovData.image == null) {
            return res.status(404).json({
                message: "Image not found!"
            });
        }

        res.contentType('image/png'); //ini tergantung image typenya
        res.status(200).json(fovData.image);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});

//Get Bacteria Photo Album by examinationId -> whole fov, disort berdasarkan FOVType (BTA0, BTA1TO9, BTAABOVE9)
app.get('/get-album', async (req, res) => {
    try {
        let { id } = req.params;
        let fovData = await FOVData.findById(id);

        //logic untuk sort berd. fovtype

        res.status(200).json();
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Connect to MongoDB
mongoose.connect(MONGO_URL)
.then(() => {
    console.log("Hore keconnect dbnya :3");

    app.listen(PORT, () => {
        console.log(`servernya jalan di port ${PORT}: http://localhost:3000/`);
    });
})
.catch((error) => {
    console.log("Ga keconnect dah kocak");
    console.error("Connection Error: ", error.message);
});