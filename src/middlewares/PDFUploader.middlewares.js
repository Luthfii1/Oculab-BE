const multer = require("multer");
const fs = require("fs");
const path = require("path");

const assetsDir = path.join("/tmpPdf", "assets");

// Check if the folder exists, if not, create it
if (!fs.existsSync(assetsDir)) {
  console.log("Creating assets directory path:", assetsDir);
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Define file filter for PDF files only
const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Save the PDF file to the Assets folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, assetsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the extension of the original file
    const filename = `temporaryFile-${Date.now()}${ext}`; // Create a unique filename using timestamp
    cb(null, filename);
  },
});

// Configure multer with the storage and file filter
const uploadPDF = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { uploadPDF };
