const mongoose = require('mongoose');
const { FOVDataSchema} = require('./FOVData.model.js'); 

const ExamGoalType = Object.freeze({
    SCREENING: "SCREENING",
    TREATMENT: "TREATMENT",
});

const ExamPreparationType = Object.freeze({
    SPS: "SPS",
    SP: "SP",
});

const GradingType = Object.freeze({
    NEGATIVE: "NEGATIVE",
    SCANTY: "SCANTY",
    Plus1: "Positive 1+",
    Plus2: "Positive 2+",
    Plus3: "Positive 3+",
});

const ExaminationSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        goal: {
            type: String,
            enum: Object.values(ExamGoalType),
            required: true,
        },
        preparationType: {
            type: String,
            enum: Object.values(ExamPreparationType),
            required: true,
        },
        slideId: {
            type: String,
            required: true,
        },
        recordVideo: {
            type: Buffer,
            required: false,
        },
        wsi: {
            type: Buffer,
            required: false,
        },
        examinationDate: {
            type: Date,
            required: true,
            default: Date.now()
        },
        fov: [FOVDataSchema],
        systemGrading: { 
            type: String,
            enum: Object.values(GradingType),
            required: false,
        },
        confidenceLevelAggregated: { 
            type: mongoose.Decimal128,
            required: false,
        },
        finalGrading: {
            type: String,
            enum: Object.values(GradingType),
            required: false,
        },
        systemBacteriaTotalCount: {
            type: Number,
            required: false,
        },
        bacteriaTotalCount: { 
            type: Number,
            required: false,
        },
        notes: {
            type: String,
            required: false, 
        },
        gradingDescriptionFOVCount: {
            type: Number,
            required: false
        }
    },
);

const Examination = mongoose.model("Examination", ExaminationSchema)

module.exports = {
    ExaminationSchema,
    Examination
}
