import httpStatus from 'http-status';

import catchAsync from '../utils/catchAsync.js';
import roleService from '../services/role.service.js';

const listRoles = catchAsync(async (req, res) => {
  const result = await roleService.listRoles(req.query);
  return res.status(httpStatus.OK).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

const createRole = catchAsync(async (req, res) => {
    console.log('Creating role with request body:', req.body);
    
  const role = await roleService.createRole(req.body);
  return res.status(httpStatus.CREATED).json({
    success: true,
    data: role,
  });
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  return res.status(httpStatus.OK).json({
    success: true,
    data: role,
  });
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  return res.status(httpStatus.OK).json({
    success: true,
    data: role,
  });
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRole(req.params.id);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'Role deleted',
  });
});

export default {
  listRoles,
  createRole,
  getRole,
  updateRole,
  deleteRole,
};
