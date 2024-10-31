const multer = require("multer");
const fs = require("fs");
const path = require("path");

const assetsDir = path.join("/tmp", "assets");

// Check if the folder exists, if not, create it
if (!fs.existsSync(assetsDir)) {
  console.log("Creating assets directory path:", assetsDir);
  fs.mkdirSync(assetsDir, { recursive: true }); // 'recursive: true' ensures parent folders are created if they don't exist
}

// save temporary file to Assets folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, assetsDir);
  },
  filename: function (req, file, cb) {
    cb(null, "temporaryVideo.mp4");
  },
});

const uploadVideo = multer({ storage: storage });

module.exports = { uploadVideo };
