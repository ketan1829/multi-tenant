import express from 'express';

import auth from '../middleware/auth.js';
import requirePermissions from '../middleware/requirePermissions.js';

import timezoneController from '../controllers/timezone.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', requirePermissions(['sites:read', 'users:create']), timezoneController.listTimezones);

export default router;
