const express = require('express');
const {
    getAll,
    getById,
    addContact,
    updateContact,
    addFavourite,
    remove
} = require('../../controllers/contacts.js');

const router = express.Router();

router.get('/', getAll);

router.get('/:contactId', getById);

router.post('/', addContact);

router.put('/:contactId', updateContact);

router.patch('/:contactId', addFavourite);

router.delete('/:contactId', remove);

module.exports = router;