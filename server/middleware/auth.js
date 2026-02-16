import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Role from '../models/Role.js';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token missing');
        }
        const decoded = jwt.verify(token, config.jwt.secret);

        // console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.sub).populate('role').populate('site');

        // console.log('Fetched user:', user);
        
    
        if (!user || user.status !== 'active') {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or inactive');
        }

        const role = user.role;
        const permissions = Array.isArray(role?.permissions) ? role.permissions : [];

        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            roleId: role?._id?.toString(),
            roleName: role?.name,
            permissions,
            siteId: user.site ? user.site._id.toString() : null,
        };
        // console.log('Authenticated user:', req.user);
        

        return next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token expired'));
        }
        if (err.name === 'JsonWebTokenError') {
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
        }
        return next(err);
    }
};

export default auth;
