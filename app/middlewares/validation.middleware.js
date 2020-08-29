import Joi from 'joi';

export default (schema) => (req, res, next) => {
    const { error } = Joi.object().keys(schema).validate(req.body);
    if (!error) return next();

    const { details } = error;
    const message = details.map((detail) => detail.message).join(',');

    return res.status(422).json({ error: message });
};
