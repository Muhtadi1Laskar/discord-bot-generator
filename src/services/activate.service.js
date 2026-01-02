import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import singupModel from "../models/users.model.js"
import { ApiError } from "../utils/error.js";

export const activateUser = async (token) => {
    const user = await singupModel.findOne({
        activationTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
        throw new ApiError(401, "Invalid or expired activation token");
    }

    const isMatch = await bcrypt.compare(token, user.activationToken);
    if (!isMatch) {
        throw new ApiError(400, "Invalid activation token");
    }

    user.isActive = true;
    user.activationToken = null;
    user.activationTokenExpiry = null;
    await user.save();

    return "Account activate successfully";;
}