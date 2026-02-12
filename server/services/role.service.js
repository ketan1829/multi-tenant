import httpStatus from 'http-status';

import Role from '../models/Role.js';
import User from '../models/User.js';

import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';

const listRoles = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const filter = {};

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { description: regex }];
  }

  const rolesPromise = Role.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const countPromise = Role.countDocuments(filter);

  const [roles, total] = await Promise.all([rolesPromise, countPromise]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: roles.map((r) => ({
      id: r._id.toString(),
      name: r.name,
      description: r.description,
      permissions: r.permissions,
      isSystem: r.isSystem,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const createRole = async (payload) => {
    console.log('Creating role with payload:', payload);
  const existing = await Role.findOne({ name: payload.name.trim() });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role name already exists');
  }

  const role = await Role.create({
    name: payload.name.trim(),
    description: payload.description || '',
    permissions: payload.permissions || [],
  });

  return {
    id: role._id.toString(),
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    isSystem: role.isSystem,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

const getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  return {
    id: role._id.toString(),
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    isSystem: role.isSystem,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

const updateRole = async (id, payload) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  if (role.isSystem) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'System roles cannot be modified');
  }

  if (payload.name && payload.name.trim() !== role.name) {
    const existing = await Role.findOne({ name: payload.name.trim() });
    if (existing) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Role name already exists');
    }
    role.name = payload.name.trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'description')) {
    role.description = payload.description || '';
  }

  if (Array.isArray(payload.permissions)) {
    role.permissions = payload.permissions;
  }

  await role.save();

  return {
    id: role._id.toString(),
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    isSystem: role.isSystem,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  if (role.isSystem) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'System roles cannot be deleted');
  }

  const userCount = await User.countDocuments({ role: role._id });

  if (userCount > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete role: it is assigned to one or more users'
    );
  }

  await Role.findByIdAndDelete(role._id);
};

export default {
  listRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
