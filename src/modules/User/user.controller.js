
import bcrypt from "bcrypt"
import Users from "#src/models/Users.js";

class UserController {
    async getUserInfo(req, res) {
        try {
            const { _id } = req.user
            // const bank = await Bank.findOne({ userId: _id }).lean();
            const data = await Users.findById(_id).select("money username role ipInfo").lean();
            const { _id: id, role, ...obj } = data;
            
            obj.id = id
            if(role === 1) { obj.isAdmin = 1}
            if(role === 2) { obj.isCustomer = 1}
            // let obj = { ...data, id: data._id, isAdmin: 1};
            // if (bank) {
            //     obj = Object.assign(obj, {
            //         bank_number: bank.accountNumber.replace(/.(?=.{4})/g, 'x'),
            //         bank_user: bank.holder,
            //         bank_id: bank.bankName,
            //         check_bank: true,
            //     });
            // }
            return res.json({ data: obj })
        } catch (error) {
            console.log("[get userInfo error]", error)
        }
    }
}

export default new UserController()