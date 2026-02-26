import Joi from 'joi';

const registerUserValidateSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
    role: Joi.string().optional(),
})

const loginUserValidateSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
})

const registerUserValidation = (req, res, next) => {
    const { error } = registerUserValidateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const loginUserValidation = (req, res, next) => {
    const { error } = loginUserValidateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export { registerUserValidation, loginUserValidation };