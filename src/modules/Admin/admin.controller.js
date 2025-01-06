import bcrypt from "bcrypt"
import Users from "#src/models/Users.js"
import ChatSettting from "#src/models/ChatSettting.js"
import authService from "../Auth/auth.service.js"

class AdminController {

    //auth
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await Users.findOne({ username, role: 1 }).select("+password");
            if (!user || !user.comparePassword(password)) {
                return res.json({
                    error: "Tài khoản hoặc mật khẩu không chính xác."
                })
            }
            const token = authService.signToken({ id: user._id, username: user.username })
            return res.json({ data: token })
        } catch (error) {
            console.log("[adminauth.login] error", error)
        }
    }

    async getChatSttings(req, res) {
        try {
            const data = await ChatSettting.findOne({}).lean();
            return res.json({ data })
        } catch (error) {
            console.log("[get chat settings error]")
        }
    }

    async updateChatSttings(req, res) {
        try {
            const { schedule, message, message2 } = req.body
            const data = await ChatSettting.findOneAndUpdate({}, {
                schedule,
                message,
                message2
            }, {
                new: true,
                upsert: true
            })
            return res.json({ data })
        } catch (error) {
            console.log("[update chat settings error]", error)
        }
    }
}

export default new AdminController()