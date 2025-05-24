const Express = require("express");
const router = Express.Router();
const pdfControllers = require("../controllers/PDF.controllers");

router.get("/get-data-for-pdf-by-id/:examinationId", pdfControllers.getDataForPDF);

module.exports = router;
