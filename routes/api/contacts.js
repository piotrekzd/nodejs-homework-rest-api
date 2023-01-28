const express = require('express');
const contactController = require('../../controllers/contacts.js');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, contactController.getAll);

router.get('/:contactId', auth, contactController.getById);

router.post('/', auth,  contactController.addContact);

router.put('/:contactId', auth, contactController.updateContact);

router.patch('/:contactId', auth, contactController.addFavourite);

router.delete('/:contactId', auth, contactController.remove);

module.exports = router;