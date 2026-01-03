import mongoose from "mongoose";

const oauthStateScheme = new mongoose.Schema({
    state: { type: String, required: true, index: { unique: true, expires: 600 } }, // Auto-delete after 10 min
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model("OauthState", oauthStateScheme);