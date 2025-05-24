const { Examination } = require("../models/Entity/Examination.models");
const { Patient } = require("../models/Entity/Patient.models");
const { ExpertExamResult } = require("../models/Entity/ExpertExamResult.model");
const { User } = require("../models/Entity/User.models");
const { StatusExaminationType } = require("../models/Enum/StatusExaminationType.enum");

exports.getDataForPDF = async function (examinationId) {
  const examination = await Examination.findById(examinationId);
  if (!examination) {
    throw new Error("Examination not found");
  }
  if (examination.statusExamination !== StatusExaminationType.FINISHED) {
    throw new Error("Examination not finished");
  }

  // Fetch all required data in parallel
  const [patient, laborant, expertResult] = await Promise.all([
    Patient.findOne({ resultExamination: examinationId }),
    User.findOne({ _id: examination.PIC }),
    ExpertExamResult.findOne({ _id: examination.expertResult })
  ]);

  // Validate required data
  if (!patient) throw new Error("Patient not found");
  if (!laborant) throw new Error("Laborant not found");
  if (!expertResult) throw new Error("Expert result not found");

  return {
    message: "Data for PDF retrieved successfully",
    data: {
      kopPDFData: {
        desc: "Pathologist Expert Companion for Accessible TB Care",
        notelp: "+62 838-5713-0641",
        email: "ai.oculab@gmail.com"
      },
      patientPDFData: {
        name: patient.name,
        nik: patient.NIK,
        age: new Date().getFullYear() - new Date(patient.DoB).getFullYear(),
        sex: patient.sex,
        bpjs: patient.BPJS || "-"
      },
      preparatPDFData: {
        id: examination.slideId,
        place: "-",
        laborant: laborant.name
      },
      hasilPDFData: {
        tujuan: examination.goal,
        jenisUji: examination.preparationType,
        hasil: expertResult.finalGrading,
        idSediaan: examination.slideId,
        descInterpretasi: "Pelaporan BTA pada Sediaan dengan Pewarnaan Z-N berdasarkan Rekomendasi IUALTD/WHO. Hasil positif pada sediaan BTA (Bakteri Tahan Asam) menjadi indikasi awal adanya infeksi mikobakteri dan potensi penyakit TB. Positifnya hasil sediaan dan tingkatan BTA mencerminkan beban bakteri relatif dan terkait dengan gejala penyakit. Terapi pasien untuk TB dapat dimulai berdasarkan hasil sediaan dan presentasi klinis, dengan perubahan status BTA yang penting untuk memantau respons terapi. NOTES: PERLU DIGANTI DI MASA DEPAN",
        descNotesPetugas: expertResult.notes
      }
    }
  };
};

