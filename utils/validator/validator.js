const joi = require('joi');

const contactSchema = joi.object({
    name: joi.string(),
    email: joi.string().email(),
    phone: joi.string(),
});

const validator = (schema) => (body) => {
    return schema.validate(body, { abortEarly: false });
};

const contactsValidator = validator(contactSchema);

const userSchema = joi.object({
    email: joi.string().email(),
    password: joi.string()
});

const userValidator = validator(userSchema)

module.exports = { contactsValidator, userValidator };