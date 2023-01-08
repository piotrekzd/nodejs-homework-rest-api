const express = require('express');
const { contactsValidator } = require('./../../utils/validator/validator');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  createNewContact,
  // updateContact,
} = require('./../../models/contacts.js');

const router = express.Router()

router.get('/', async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: 'Not Found' });
  } else {
    res.status(200).json(contact);
  };
});

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = contactsValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  };
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'missing required field' });
  };
  const newContact = await createNewContact(req.body);
  await addContact(req.body);
  res.status(201).send(newContact);
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const requestedContactById = await getContactById(contactId);
  if (!requestedContactById) {
    return res.status(404).json({ message: 'Not Found' });
  } else {
    await removeContact(contactId);
    res.status(200).json({ message: 'contact deleted successfully' });
  };
});

// router.put('/:contactId', async (req, res, next) => {
//   res.status(200).json({ message: 'contact updated successfully' })
// })

module.exports = router
