import express from 'express';

import auth from '../middleware/auth.js';
import requirePermissions from '../middleware/requirePermissions.js';
import validate from '../middleware/validate.js';

import userController from '../controllers/user.controller.js';

import userValidation from '../validation/user.validation.js';

const router = express.Router();

router.use(auth);

router.get(
  '/',
  requirePermissions(['users:read']),
  validate(userValidation.listUsers),
  userController.listUsers
);

router.post(
  '/',
  requirePermissions(['users:create']),
  validate(userValidation.createUser),
  userController.createUser
);

router.get(
  '/:id',
  requirePermissions(['users:read']),
  validate(userValidation.getUser),
  userController.getUser
);

router.put(
  '/:id',
  requirePermissions(['users:update']),
  validate(userValidation.updateUser),
  userController.updateUser
);

router.patch(
  '/:id/deactivate',
  requirePermissions(['users:deactivate']),
  validate(userValidation.deactivateUser),
  userController.deactivateUser
);

export default router;
