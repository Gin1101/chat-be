import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import mongooseLong from 'mongoose-long';
import { alphabetIdGenerator } from "#src/helpers/id.js";

mongooseLong(mongoose)

const Schema = new mongoose.Schema({

    idUser: { type: String, unique: true, required: true },

    username: { type: String, unique: true, required: true },

    password: { type: String, require: true, select: false },

    ref: { type: String, require: true, unique: true, default: () => alphabetIdGenerator(7) },

    invite_from_code: { type: String }, // Mã người giới thiệu

    role: { type: Number, require: true, enum: [0, 1, 2], default: 0 },  // Vai trò của người dùng

    isDisabled: { type: Number, default: 0 },

    ipInfo: { type: String, default: null },

}, {
    timestamps: true
});

Schema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

const model = mongoose.model("User", Schema);

export default model
