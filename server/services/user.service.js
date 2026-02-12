import httpStatus from 'http-status';

import User from '../models/User.js';
import Role from '../models/Role.js';
import Site from '../models/Site.js';

import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.site) {
    filter.site = query.site;
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const usersPromise = User.find(filter)
    .populate('role')
    .populate('site')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password');

  const countPromise = User.countDocuments(filter);

  const [users, total] = await Promise.all([usersPromise, countPromise]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      status: u.status,
      role: u.role
        ? {
            id: u.role._id.toString(),
            name: u.role.name,
          }
        : null,
      site: u.site
        ? {
            id: u.site._id.toString(),
            name: u.site.name,
            location: u.site.location,
          }
        : null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};



const createUser = async (payload) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
  }

  const role = await Role.findById(payload.role);
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }

  let site = null;
  if (payload.site) {
    site = await Site.findById(payload.site);
    if (!site) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid site');
    }
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: role._id,
    site: site ? site._id : undefined,
    status: payload.status || 'active',
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    status: user.status,
    role: {
      id: role._id.toString(),
      name: role.name,
    },
    site: site
      ? {
          id: site._id.toString(),
          name: site.name,
          location: site.location,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};



const getUserById = async (id) => {
  const user = await User.findById(id).populate('role').populate('site').select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    status: user.status,
    role: user.role
      ? {
          id: user.role._id.toString(),
          name: user.role.name,
        }
      : null,
    site: user.site
      ? {
          id: user.site._id.toString(),
          name: user.site.name,
          location: user.site.location,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateUser = async (id, payload) => {
  const user = await User.findById(id).select('+password');

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (payload.email && payload.email !== user.email) {
    const exists = await User.findOne({ email: payload.email });
    if (exists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
    }
    user.email = payload.email;
  }

  if (payload.name) {
    user.name = payload.name;
  }

  if (payload.password) {
    user.password = payload.password;
  }

  let role = null;
  if (payload.role) {
    role = await Role.findById(payload.role);
    if (!role) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
    }
    user.role = role._id;
  }

  let site = null;
  if (Object.prototype.hasOwnProperty.call(payload, 'site')) {
    if (payload.site) {
      site = await Site.findById(payload.site);
      if (!site) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid site');
      }
      user.site = site._id;
    } else {
      user.site = undefined;
    }
  }

  if (payload.status) {
    user.status = payload.status;
  }

  await user.save();

  const populatedUser = await User.findById(user._id).populate('role').populate('site').select('-password');

  return {
    id: populatedUser._id.toString(),
    name: populatedUser.name,
    email: populatedUser.email,
    status: populatedUser.status,
    role: populatedUser.role
      ? {
          id: populatedUser.role._id.toString(),
          name: populatedUser.role.name,
        }
      : null,
    site: populatedUser.site
      ? {
          id: populatedUser.site._id.toString(),
          name: populatedUser.site.name,
          location: populatedUser.site.location,
        }
      : null,
    createdAt: populatedUser.createdAt,
    updatedAt: populatedUser.updatedAt,
  };
};

const deactivateUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === 'inactive') {
    return;
  }

  user.status = 'inactive';
  await user.save();
};

export default {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
};
