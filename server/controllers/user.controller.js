import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import userService from '../services/user.service.js';

const listUsers = catchAsync(async (req, res) => {
  const result = await userService.listUsers(req.query);
  return res.status(httpStatus.OK).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(httpStatus.CREATED).json({
    success: true,
    data: user,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.status(httpStatus.OK).json({
    success: true,
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return res.status(httpStatus.OK).json({
    success: true,
    data: user,
  });
});

const deactivateUser = catchAsync(async (req, res) => {
  await userService.deactivateUser(req.params.id);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'User deactivated',
  });
});

export default {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deactivateUser,
};
