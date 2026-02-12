import express from 'express';

import auth from '../middleware/auth.js';
import requirePermissions from '../middleware/requirePermissions.js';
import validate from '../middleware/validate.js';


import roleController from '../controllers/role.controller.js';
import roleValidation from '../validation/role.validation.js';

const router = express.Router();

router.use(auth);

router.get(
  '/',
  requirePermissions(['roles:read']),
  validate(roleValidation.listRoles),
  roleController.listRoles
);

router.post(
  '/',
  requirePermissions(['roles:create']),
  validate(roleValidation.createRole),
  roleController.createRole
);

router.get(
  '/:id',
  requirePermissions(['roles:read']),
  validate(roleValidation.getRole),
  roleController.getRole
);

router.put(
  '/:id',
  requirePermissions(['roles:update']),
  validate(roleValidation.updateRole),
  roleController.updateRole
);

router.delete(
  '/:id',
  requirePermissions(['roles:delete']),
  validate(roleValidation.deleteRole),
  roleController.deleteRole
);

export default router;
