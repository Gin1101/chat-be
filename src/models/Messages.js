import mongoose from "mongoose";

const Schema = new mongoose.Schema({

    idUserSend: { type: String, unique: true, required: true }, // id nguoi gui
    usernameSend: { type: String, unique: true, required: true }, // ten ng gui
    idUserRecieve: { type: String, unique: true, required: true }, // id nguoi nhan
    usernameRecieve: { type: String, unique: true, required: true }, // ten ng nhan
    content: { type: String, required: true }, // message
}, {
    timestamps: true
});


const model = mongoose.model("Messages", Schema);

export default model
