import Joi from "joi"

const loginSchema = Joi.object().keys({ username: Joi.string().required(), password: Joi.string().min(6).required() });

const verifyTokenSchema = Joi.object().keys({ token: Joi.string().required() });

export default {
  loginSchema,
  verifyTokenSchema
}
