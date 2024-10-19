const multer = require("multer");

// save temporary file to Assets folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets");
  },
  filename: function (req, file, cb) {
    cb(null, "temporaryVideo.mp4");
  },
});

const uploadVideo = multer({ storage: storage });

module.exports = { uploadVideo };
