import { StatusCodes } from 'http-status-codes';

const validate = (schema, param = "body") => (req, res, next) => {
    let joiSchema = schema
    if ("function" === typeof schema) {
        joiSchema = schema();
    }
    const {
        error,
        value
    } = joiSchema.validate(req[param]);
    
    if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: error.details[0].message
        })
    } else {
        req[param] = { ...value }
        next();
    }
};

export {
    validate
}