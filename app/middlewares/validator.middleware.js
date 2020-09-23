import Joi from 'joi';

export default (schema, property = 'body') => (req, res, next) => {
    const { error, value } = Joi.object(schema).options({ stripUnknown: true }).validate(req[property]);

    if (error) {
        const { details } = error;
        const message = details.map((detail) => detail.message).join(',');

        return res.status(400).json({ message });
    }

    req[property] = value;

    return next();
};
