import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Role from '../models/Role.js';

const generateToken = (user, role) => {
  const payload = {
    sub: user._id.toString(),
    roleId: role?._id?.toString(),
    permissions: role?.permissions || [],
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  console.log("token gen", token);
  

  return token;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password').populate('role');

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  console.log(isMatch);
  
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is inactive');
  }

  const role = user.role || (await Role.findById(user.role));

  const token = generateToken(user, role);

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      roleId: role?._id?.toString(),
      roleName: role?.name,
      permissions: role?.permissions || [],
    },
  };
};

const seedInitialAdmin = async () => {
  const adminRoleName = 'Admin';

  let adminRole = await Role.findOne({ name: adminRoleName });

  if (!adminRole) {
    adminRole = await Role.create({
      name: adminRoleName,
      description: 'System administrator',
      permissions: [
        'users:read',
        'users:create',
        'users:update',
        'users:deactivate',
        'roles:read',
        'roles:create',
        'roles:update',
        'roles:delete',
        'sites:read',
        'sites:create',
        'sites:update',
        'sites:delete',
        'dashboard:read',
      ],
      isSystem: true,
    });
  }

  const existingAdmin = await User.findOne({ email: 'admin@tenantapp.local' });

  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: 'ketan@test.com',
      password: 'Admin@123',
      role: adminRole._id,
      status: 'active',
    });
  }
};

export default {
  login,
  seedInitialAdmin,
};
