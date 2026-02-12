import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

const requirePermissions = (requiredPermissions = []) => (req, res, next) => {
  if (!req.user) {
    console.log('User not authenticated');
    
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated'));
  }

  if (!requiredPermissions.length) {
    return next();
  }

  const userPermissions = req.user.permissions || [];

  const hasAll = requiredPermissions.every((perm) => userPermissions.includes(perm));

  if (!hasAll) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
  }

  return next();

  
};

export default requirePermissions;
