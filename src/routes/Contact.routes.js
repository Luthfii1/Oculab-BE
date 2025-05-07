const Express = require("express");
const router = Express.Router();
const contactController = require("../controllers/Contact.controllers");

router.get(
  "/get-whatsapp-link/:contactId",
  contactController.getWhatsappLinkByContactId
);

module.exports = router;
