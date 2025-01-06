import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    schedule: [{
        day: { type: Number },
        from: { type: String },
        to: { type: String }
    }],
    message: { type: String, default: "" },
    message2: { type: String, default: "" }
});

export default mongoose.model("ChatSetting", Schema);
