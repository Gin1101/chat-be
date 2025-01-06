
import Users from "#src/models/Users.js"
import authService from "./auth.service.js"
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { asyncVerifyToken } from "#src/middleware/auth.js";
class AuthController {
    async login(req, res) {
        try {
            console.log(req.ip)
            const { username, password } = req.body
            const user = await Users.findOne({ username }).select("+password");
            if (!user || !user.comparePassword(password)) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: "Tài khoản hoặc mật khẩu không chính xác."
                })
            }

            if (user.isDisabled) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: "Tài khoản của bạn đã bị khóa"
                })
            }
            const token = authService.signToken({ id: user._id, username: user.username })
            return res.json({ data: token })
        } catch (error) {
            console.log("[auth.login] error", error)
        }
    }

    async verifyToken3rd(req, res) {
        try {
            const { token } = req.body
            asyncVerifyToken(token, process.env.JWT_SECRET_3RD).then(async (decode) => {
                const { _id: id, username, ipInfo } = decode;
                const user = await Users.findOneAndUpdate({ idUser: id, username }, {ipInfo}, { new: true, upsert: true });
                const token = authService.signToken({ id: user._id, username: user.username })
                return res.json({ data: token })
            }).catch(error => {
                console.log(error)
                res.status(StatusCodes.UNAUTHORIZED).json({error: "Invalid token"})
            })

        } catch (error) {
            console.log('verifyToken3rd error', error)}
    }
}


export default new AuthController()
