import express from 'express';

import auth from '../middleware/auth.js';
import requirePermissions from '../middleware/requirePermissions.js';

import dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', requirePermissions(['dashboard:read']), dashboardController.getOverview);

export default router;
