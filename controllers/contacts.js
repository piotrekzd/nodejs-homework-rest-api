const service = require('../service/index.js');

const getAll = async (req, res, next) => {
    try {
        const results = await service.getAllContacts();
        res.status(200).json(results);
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await service.getContactById(contactId);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        if (contact) return res.status(200).json({ newContact: contact });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const addContact = async (req, res, next) => {
    try {
        const name = req.body.name;
        if (!name) return res.status(400).json({ message: 'Missing required name field' });
        const result = await service.createNewContact(req.body);
        if (!result) return res.status(404).json({ message: 'Something went wrong' });
        if (result) return res.json({ status: 'succes', code: 201, data: { result } });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { name, email, phone } = req.body;
        if (!name && !email && !phone) return res.status(400).json({ message: 'Missing required fields' });
        const result = await service.updateContact(contactId, req.body);
        if (!result) return res.status(404).json({ message: 'Not found' });
        if (result) return res.json({ status: 'succes', code: 201, data: { result } });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const addFavourite = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { favourite } = req.body;
        if (favourite === undefined || favourite === null)
            return res.status(400).json({ message: 'Missing favourite field' });
        const result = await service.updateContactStatus(contactId, req.body);
        if (!result) return res.status(404).json({ message: 'Not found' });
        if (result) return res.json({ status: 'succes', code: 201, data: { result } });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

const remove = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await service.removeContact(contactId);
        if (!contact) return res.status(404).json({ message: 'Not found' });
        if (contact) return res.status(200).json({ message: 'Contact deleted succesfully' });
    } catch (error) {
        console.log(error.message);
        next(error);
    };
};

module.exports = {
    getAll,
    getById,
    addContact,
    updateContact,
    addFavourite,
    remove
}