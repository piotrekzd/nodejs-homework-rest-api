const express = require('express');
const contactController = require('../../controllers/contacts.js');

const router = express.Router();

router.get('/', contactController.getAll);

router.get('/:contactId', contactController.getById);

router.post('/', contactController.addContact);

router.put('/:contactId', contactController.updateContact);

router.patch('/:contactId', contactController.addFavourite);

router.delete('/:contactId', contactController.remove);

module.exports = router;