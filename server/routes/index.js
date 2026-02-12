import express from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import roleRoutes from './role.routes.js';
import siteRoutes from './site.routes.js';

import timezoneRoutes from './timezone.routes.js';
import dashboardRoutes from './dashboard.routes.js';



const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/sites', siteRoutes);
router.use('/timezones', timezoneRoutes);
router.use('/dashboard', dashboardRoutes);


export default router;
