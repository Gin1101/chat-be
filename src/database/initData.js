import { connectDB } from "./mongoDB.js";
import Users from "../models/Users.js";
import bcrypt from "bcrypt"

const initProducts = async () => {
    try {
       
        const existUser = await Users.findOne({role: 1});
        if(!existUser) {
            await new Users({
                idUser: "1",
                username: "admin",
                role: 1,
                password: bcrypt.hashSync("123123", 12)
            }).save()
        }

        console.log("init DB successfull")
    } catch (error) {
        console.log("[init DB] error", error)
    }
}

if (process.env.INIT_DB == 'true') {
    connectDB().then(async () => {
        await initProducts();
        process.exit()
    })
}
