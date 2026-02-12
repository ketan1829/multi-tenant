import express from 'express';

import auth from '../middleware/auth.js';
import requirePermissions from '../middleware/requirePermissions.js';
import validate from '../middleware/validate.js';

import siteController from '../controllers/site.controller.js';
import siteValidation from '../validation/site.validation.js';

const router = express.Router();

router.use(auth);

router.get(
    '/',
    requirePermissions(['sites:read']),
    validate(siteValidation.listSites),
    siteController.listSites
);

router.post(
    '/',
    requirePermissions(['sites:create']),
    validate(siteValidation.createSite),
    siteController.createSite
);

router.get(
    '/:id',
    requirePermissions(['sites:read']),
    validate(siteValidation.getSite),
    siteController.getSite
);

router.put(
    '/:id',
    requirePermissions(['sites:update']),
    validate(siteValidation.updateSite),
    siteController.updateSite
);

router.delete(
    '/:id',
    requirePermissions(['sites:delete']),
    validate(siteValidation.deleteSite),
    siteController.deleteSite
);

export default router;
