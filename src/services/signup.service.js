import bcrypt from "bcrypt";
import singupModel from "../models/users.model.js";
import { ApiError } from "../utils/error.js";
import { generateActivationToken } from "../utils/utils.js";

export const signup = async ({ email, phone, firstName, lastName, password, role }) => {
    const existing = await singupModel.findOne({ email });
    if (existing) throw new ApiError(409, "User with this email already exists");


    const plainToken = generateActivationToken();
    const hashedToken = await bcrypt.hash(plainToken, 10);

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await singupModel.create({
        email,
        phone,
        firstName,
        lastName,
        role,
        password: encryptedPassword,
        isActive: false,
        activationToken: hashedToken,
        activationTokenExpiry: Date.now() + 3600000
    });
    const activationLink = `${process.env.ACTIVATE_URL}/${plainToken}`;

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        link: activationLink
    };
}