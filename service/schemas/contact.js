const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favourite: {
            type: Boolean,
            default: false,
        },
    },
);

const Contact = model('contact', contactSchema);

module.exports = { Contact };