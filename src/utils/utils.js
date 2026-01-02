import { randomBytes } from "crypto";

export const generateActivationToken = () => {
    return randomBytes(32).toString("hex");
}