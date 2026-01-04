import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const secret = process.env.JWT_SECRET;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return errorResponse(res, {
                message: "Authorization header is required"
            }, 401);
        }

        if (!authHeader.startsWith("Bearer ")) {
            return errorResponse(res, {
                message: "Invalid authorization format. Use Bearer <token>"
            }, 401);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return errorResponse(res, {
                message: "Token is missing"
            }, 401);
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        if (decoded.user.id) {
            req.userId = decoded.user.id;
        }


        if (!decoded || typeof decoded !== "object") {
            return errorResponse(res, {
                message: "Invalid token payload"
            }, 401);
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(res, {
                message: 'Invalid token'
            }, 401);
        }

        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, {
                message: 'Token has expired',
                expiredAt: error.expiredAt
            }, 401);
        }

        if (error.name === 'NotBeforeError') {
            return errorResponse(res, {
                message: 'Token not yet valid',
                date: error.date
            }, 401);
        }

        console.error('JWT Verification Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        return errorResponse(res, {
            message: 'Authentication failed'
        }, 500);
    }
}