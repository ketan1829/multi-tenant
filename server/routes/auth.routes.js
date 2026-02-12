import express from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import authValidation from '../validation/auth.validation.js';

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);

// Optional: seed initial admin (remove or protect in production)
router.post('/seed-admin', authController.seedAdmin);

export default router;
