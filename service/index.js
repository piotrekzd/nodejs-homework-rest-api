const { Contact } = require('./schemas/contact.js');

const getAllContacts = async () => Contact.find();

const getContactById = async (contactId) => Contact.findById(contactId);

const createNewContact = async (body) => Contact.create(body);

const updateContact = async (contactId, fields) =>
    Contact.findByIdAndUpdate(contactId, fields, { new: true });

const removeContact = async (contactId) => Contact.findByIdAndRemove(contactId);

const updateContactStatus = (contactId, body) =>
    Contact.findByIdAndUpdate(contactId, body, { new: true });

module.exports = {
    getAllContacts,
    getContactById,
    createNewContact,
    updateContact,
    removeContact,
    updateContactStatus
};