const { Contact } = require("../models/Entity/Contact.models");

exports.getWhatsappLinkByContactId = async function (params) {
  const { contactId } = params;
  if (!contactId || contactId === ":contactId") {
    throw new Error("Contact ID is required");
  }

  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new Error("Contact not found");
  }

  const whatsappNumber = contact.whatsappNumber;
  const whatsappLink = `https://wa.me/${encodeURIComponent(whatsappNumber)}`;

  return {
    id: contact._id,
    whatsapp_link: whatsappLink,
  };
};
