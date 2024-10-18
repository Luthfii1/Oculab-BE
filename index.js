const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;
const MONGO_URL = "mongodb+srv://aioculab:abipapiuncle@oculab-db.r6h3s.mongodb.net/be-api?retryWrites=true&w=majority&appName=oculab-db"

const { Patient } = require('./models/patient.model.js');
const { Examination } = require('./models/examination.model.js');
const { FOVData } = require('./models/FOVData.model.js');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Muncul yey");
});


//Save (Post) all patient data - DONE
app.post('/send-patient-data', async (req, res) => { 
    try {
        let dataPatient = req.body.patient;
        console.log("patient:", dataPatient);

        if (!dataPatient) {
            res.status(404).json({
                message: "Patient data is empty!"
            });
        }

        const examinationResults = dataPatient.resultExamination;

        if(!dataPatient) {
            return res.status(404).json({
                message: "Patient data is not found!"
            });
        }

        if (!Array.isArray(examinationResults)) {
            return res.status(404).json({ message: "resultExamination is missing or not an array" });
        }

        let savedExaminations = [];

        console.log("exam: ", examinationResults);

        for (const examination of examinationResults) {
            let savedFOVs = [];

            if (Array.isArray(examination.fov)) {
                for (const fov of examination.fov) {
                    if (!fov._id) {
                        return res.status(404).json({
                            message: "_id for FOV is required!"
                        });
                    }
                    const existingFOV = await FOVData.findById(fov._id);
                    if (existingFOV) {
                        return res.status(404).json({
                            message: `FOV with _id ${fov._id} already exists!`
                        });
                    }

                    const newFOVData = new FOVData(fov);
                    const savedFOV = await newFOVData.save();
                    savedFOVs.push(savedFOV);
                }
            } else {
                return res.status(404).json({
                    message: "FOVData is missing or not an array"
                });
            }
            
            if(!examination._id) {
                return res.status(404).json({
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
            return res.status(404).json({
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

//Save (Post) initial examination data by patient Id (before record) 
 // (Examination - fase 1) - DONE
app.post('/send-examination-data/:patientId', async (req, res) => {
    try {
        let { patientId  } = req.params; //patientId
        let dataExamination = req.body.examination;

        console.log("data:", dataExamination);

        if (!dataExamination) {
            res.status(404).json({
                message: "Examination data is empty!"
            });
        }

        if (!patientId) { 
            res.status(404).json({
                message: "Patient ID not found!"
            })
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found!"
            });
        }

        const newExamination = new Examination(dataExamination);
        const savedExamination = await newExamination.save();

        patient.resultExamination.push(savedExamination);
        await patient.save();

        res.status(200).json({
            message: `Examination data received successfully and linked to patient ${patient._id}`,
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
//     //extract/forwarding video ke api ML rasyad (diterusin aja, gak disimpen)
// });

//Save (Post) fovdata system result by examinationId (after record) 
//-> system grading & bacteria total count (FOVData - fase 1) - DONE
app.post('/send-fov-data-from-system/:examinationId', async (req, res) => {
    try {
        let { examinationId } = req.params; //examinationId
        let dataFOV = req.body.FOVData;

        console.log("data:", dataFOV);

        if (!examinationId) {
            res.status(404).json({
                message: "Examination ID not found!"
            });
        }
        if (!dataFOV) {
            res.status(404).json({
                message: "FOV Data is empty!"
            })
        }

        const examination = await Examination.findById(examinationId);
        if (!examination) {
            res.status(404).json({
                message: "Examination not found!"
            })
        }

        const newFOVData = new FOVData(dataFOV);
        const savedFOVData = await newFOVData.save(); //save fovId (udah kegenerate)

        examination.fov.push(savedFOVData);
        await examination.save();

        await Patient.updateOne(
            { 'resultExamination._id': examination._id }, 
            { 
                $push: { 'resultExamination.$.fov': savedFOVData } 
            }
        );

        res.status(200).json({
            message: "FOV data received successfully and updated in both Examination and Patient",
            data: newFOVData
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.put('/update-patient-data/:patientId', async (req, res) => { // - DONE
    try {
        let { patientId } = req.params; //patientId
        let patient = await Patient.findByIdAndUpdate(patientId, req.body.patient);

        console.log("data:", patient);

        if (!patient) {
            return res.status(404).json({
                message: "Patient ID not found!"
            });
        }

        const updatedPatientData = await Patient.findById(patientId);
        res.status(200).json(updatedPatientData);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//TODO
//Save (Post by fovId) fovdata manual input by user (after system result is generated) 
// (FOVData - fase 2)
//msh gabener, di fovdata keupdate, di exam dan patient masih ver lama
//harus bikin logic bahwa commentnya nambah, bukan menggantikan comment yang lama
app.post('/send-fov-data-manual/:id', async (req, res) => {
    try {
        let { id } = req.params; //fovId
        let dataFOV = await FOVData.findByIdAndUpdate(id, req.body);

        console.log("data:", dataFOV);

        if (!dataFOV) {
            return res.status(404).json({
                message: "FOV ID not found!"
            });
        }

        const updatedExamination = await Examination.findOneAndUpdate(
            { 'fov._id': id }, // Find the examination containing this FOV
            { $set: { 'fov.$': dataFOV } }, // Update the specific FOV in the array
            { new: true }
        );

        if (!updatedExamination) {
            return res.status(404).json({
                message: "Examination containing this FOV not found!"
            });
        }

        const updatedPatient = await Patient.findOneAndUpdate(
            { 'resultExamination._id': updatedExamination._id }, // Find the patient with the specific examination
            { $set: { 'resultExamination.$[elem].fov': updatedExamination.fov } },
            {
                arrayFilters: [{ 'elem._id': updatedExamination._id }], // Array filter to target the correct examination
                new: true
            }
        );

        if (!updatedPatient) {
            return res.status(404).json({
                message: "Patient containing this Examination not found!"
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

//TODO
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

//Get all patient data - DONE
app.get('/get-all-patient-data', async (req, res) => {
    try {
        let patients = await Patient.find().populate('resultExamination'); //cek populate perlu/ga
        res.status(200).json(patients);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Get a patient data by patientId - DONE
app.get('/get-patient-data/:patientId', async (req, res) => {
    try {
        let { patientId } = req.params;
        let patient = await Patient.findById(patientId);

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

//Get Examination by patientId -> ini data full examination per pasien - DONE
app.get('/get-examination-data-by-patient-id/:patientId', async (req, res) => {
    try {
        let { patientId } = req.params; //patientId

        let patient = await Patient.findById(patientId).populate('resultExamination');

        if (!patient || !patient.resultExamination || patient.resultExamination.length === 0) {
            return res.status(404).json({
                message: "Examinations for this Patient ID not found!"
            });
        }

        const examination = patient.resultExamination;
        res.status(200).json(examination);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//!
//Get Examination by examinationId -> ini data full examination
//Get initial exam data by examinationId (Examination - fase 1)
//Get examination ai result (by system) by examinationId (Examination - fase 2)
//Get examination manual input by examinationId  (Examination - fase 3) - DONE
app.get('/get-examination-data-by-examination-id/:examinationId', async (req, res) => {
    try {
        let { examinationId } = req.params; 

        let patient = await Patient.findOne({ 'resultExamination._id': examinationId });
        if (!patient) {
            return res.status(404).json({
                message: "Examination ID not found!"
            });
        }

        const examination = patient.resultExamination.find(
            exam => exam._id === examinationId
        );

        if (!examination) {
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

//Get fovdata system result (after record) by fovId (FOVData) - DONE
app.get('/get-fov-data/:fovId', async (req, res) => {
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
// app.get('/get-image/:fovId', async (req, res) => {
//     try {
//         let { fovId } = req.params;
//         let fovData = await FOVData.findById(fovId);
//         console.log(fovData)

//         if (fovData == null || fovData.image == null) {
//             return res.status(404).json({
//                 message: "Image not found!"
//             });
//         }

//         res.status(200).json(fovData.image);
//     } catch(error){
//         res.status(500).json({
//             message: error.message
//         });
//     }
// });

// DONE
app.get('/get-image/:examinationId', async (req, res) => { 
    try {
        let { examinationId } = req.params;
        let examination = await Examination.findById(examinationId);

        let examinationImages = []
        for (i in examination.fov) {
            examinationImages.push(examination.fov[i].image)
        }

        if (examination == null) {
            return res.status(404).json({
                message: "Examination not found!"
            });
        }

        res.status(200).json({examinationImages});
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});

//Get Bacteria Photo Album by examinationId -> whole fov, disort berdasarkan FOVType (BTA0, BTA1TO9, BTAABOVE9)
app.get('/get-image-album-by-fov-type/:examinationId', async (req, res) => {
    try {
        let { examinationId } = req.params;

        let patient = await Patient.findOne({ 'resultExamination._id': examinationId});
        console.log(patient)

        if(!patient) {
            return res.status(404).json({
                message: "Examination ID not found!"
            });
        }

        const examination = patient.resultExamination.find(
            exam => exam._id.toString() === examinationId
        );

        if (!examination || !Array.isArray(examination.fov)) {
            return res.status(404).json({
                message: "FOV Data not found!"
            });
        }

        let fovGroupedByType = {
            '0 BTA': [],
            '1-9 BTA': [],
            '≥ 10 BTA': []
        };

        examination.fov.forEach(fov => {
            if (fov.type == '0 BTA') {
                fovGroupedByType['0 BTA'].push(fov.image);
            } else if (fov.type == '1-9 BTA') {
                fovGroupedByType['1-9 BTA'].push(fov.image);
            } else if (fov.type == '≥ 10 BTA') {
                fovGroupedByType['≥ 10 BTA'].push(fov.image);
            }
        });

        res.status(200).json(fovGroupedByType);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/get-result-description/:examinationId', async (req, res) => { 
    try {
        let { examinationId } = req.params;
        let examination = await Examination.findById(examinationId);

        if (!examination) {
            return res.status(404).json({
                message: "Examination not found!"
            });
        }

        let resultDescription = {
            'systemGrading': examination.systemGrading,
            'count': 0
        }

        if (examination.systemGrading == "Scanty" || examination.systemGrading == "Positive 1+") {
            resultDescription.count = examination.systemBacteriaTotalCount

        } else {
            let imageNumOfBTA1TO9 = 0;
            let imageNumOfBTAABOVE9 = 0;

            examination.fov.forEach(fov => {
                if (fov.type === '1-9 BTA') {
                    imageNumOfBTA1TO9++;
                } else if (fov.type === '≥ 10 BTA') {
                    imageNumOfBTAABOVE9++;
                }
            });
            if (examination.systemGrading == "Positive 2+") {
                resultDescription.count = imageNumOfBTA1TO9
            } else if (examination.systemGrading == "Positive 3+") {
                resultDescription.count = imageNumOfBTAABOVE9
            }
        }

        res.status(200).json(resultDescription);
    } catch(error){
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

