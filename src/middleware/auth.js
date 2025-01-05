
import jwt from "jsonwebtoken"
import UserModel from "#src/models/Users.js"
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { checkRole } from "#src/helpers/roles.js";

const signToken = (payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_TIME) => {
    return jwt.sign(
        payload,
        secret,
        { expiresIn })
}

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
    return jwt.verify(token, secret)
}

const asyncVerifyToken = (token, secret = process.env.JWT_SECRET) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(verifyToken(token, secret))
        } catch (error) {
            reject(error)
        }
    })
}

const getJwt = req => {
    try {
        return req.headers["authorization"].split(" ")[1]
    } catch (error) {
        return undefined;
    }
};

const verifyMiddleware = (role = "*") => async (req, res, next) => {
    const token = getJwt(req);
    try {
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Not found token"});
        }
        const jwtDecode = verifyToken(token);
        const userById = await UserModel.findById(jwtDecode.id).lean();
        if(userById) {
            if(userById.isDisabled) {
                throw new Error("User Locked")
            }
            if(!checkRole(role, userById.role)) {
                throw new Error("Not Permisions")
            }
            req.user = { ...userById, _id: jwtDecode.id }
            next();
        } else {
            throw new Error("user not Found")
        }
       
    } catch (error) {
        console.log("err", String(error))
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
    }
};

export { signToken, verifyToken, asyncVerifyToken, verifyMiddleware };
