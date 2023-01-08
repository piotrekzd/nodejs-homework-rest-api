const fs = require('fs/promises')
const path = require('path');

const contactsPath = path.resolve('./models/contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf-8' });
    const contactsList = JSON.parse(data);
    return contactsList;
  } catch (error) {
    console.log(error.message);
  };
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const requestedContactById = contacts.find(({ id }) => id === contactId);
    return requestedContactById;
  } catch (error) {
    console.log(error.message);
  };
};

const createNewContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contacts = await listContacts();
    const newId = Math.max(...contacts.map(contact => parseInt(contact.id, 10))) + 1;
    const newContact = { id: newId.toString(), name, email, phone };
    return newContact;
  } catch (error) {
    console.log(error.message);
  };
};

const addContact = async (body) => {
  try {
    if (!body) return;
    const contacts = await listContacts();
    const getNewContact = await createNewContact(body);
    const updatedContacts = [...contacts, getNewContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), { encoding: 'utf-8' });
  } catch (error) {
    console.log(error.message);
  };
};

// const contactToUpdate = async (contactId, body) => {
//   try {
//     const contacts = await listContacts();
//     const { name, email, phone } = body;
//     const [contactToUpdate] = contacts.filter(({ id }) => id === contactId);
//     contactToUpdate.name = name;
//     contactToUpdate.email = email;
//     contactToUpdate.phone = phone;
//   } catch (error) {
//     console.log(error.message);
//   };
// };

const updateContact = async (contactId, body) => {
  try {
    // const contacts = await listContacts();
    // const update = await contactToUpdate(contactId, body)
    // const contactIndex = await contacts.find(({ id }) => id === contactId);
    // const updatedContacts = await contacts.splice(contactIndex, 1, update);
    const contacts = await listContacts();
    const { name, email, phone } = body;
    const [contactToUpdate] = await contacts.filter(({ id }) => id === contactId);
    contactToUpdate.name = name;
    contactToUpdate.email = email;
    contactToUpdate.phone = phone;
    const contactIndex = await contacts.findIndex(({ id }) => id === contactId);
    const updatedContacts = await contacts.splice(contactIndex, 1, contactToUpdate);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), { encoding: 'utf-8' });   
  } catch (error) {
    console.log(error.message);
  };
}; // do dokończenia! wywala 

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const filteredContacts = await contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2), { encoding: 'utf-8' });
  } catch (error) {
    console.log(error.message);
  };
};

module.exports = {
  listContacts,
  getContactById,
  createNewContact,
  addContact,
  // contactToUpdate,
  updateContact,
  removeContact,
};