
import jwt from "jsonwebtoken"

class AuthService {
    signToken(payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_TIME) {
        return jwt.sign(
            payload,
            secret,
            { expiresIn })
    }
}

export default new AuthService()